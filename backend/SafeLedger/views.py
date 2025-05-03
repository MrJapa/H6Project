# backend/SafeLedger/views.py
import os
import json
import pickle
import numpy as np
from rest_framework.permissions import BasePermission
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest
from .ml.ml_model import scalers, iso_forests
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.views.decorators.http import require_POST
from django.views.generic import View
from django.http import HttpResponse

from .models import Postings, Company, User
from .serializers import PostingsSerializer, CompanySerializer, CustomerSerializer, AccountantSerializer

    
class FrontendAppView(View):
    def get(self, request):
        try:
            BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            with open(os.path.join(BASE_DIR, 'frontend', 'build', 'index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            return HttpResponse(
                "index.html not found. Please build your React app (npm run build).",
                status=501,
            )

class IsSuperuserRole(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "superuser"
    
class RetrainModelView(APIView):
    permission_classes = [IsAuthenticated, IsSuperuserRole]

    def post(self, request):
        cid = request.data.get("company_id")
        # pick either one company or all
        if cid:
            companies = [Company.objects.get(id=cid)]
        else:
            companies = Company.objects.all()

        # if single company, retrain only that one
        if cid:
            for comp in companies:
                qs = Postings.objects.filter(company=comp)
                X = np.array([[p.accountHandleNumber, float(p.postAmount)] for p in qs])
                if X.size == 0:
                    continue
                scaler = StandardScaler().fit(X)
                iso    = IsolationForest(contamination=0.05, random_state=42).fit(scaler.transform(X))
                scalers[comp.id]     = scaler
                iso_forests[comp.id] = iso
        else:
            # full retrain: clear and rebuild everything
            scalers.clear()
            iso_forests.clear()
            for comp in companies:
                qs = Postings.objects.filter(company=comp)
                X = np.array([[p.accountHandleNumber, float(p.postAmount)] for p in qs])
                if X.size == 0:
                    continue
                scaler = StandardScaler().fit(X)
                iso    = IsolationForest(contamination=0.05, random_state=42).fit(scaler.transform(X))
                scalers[comp.id]     = scaler
                iso_forests[comp.id] = iso

        # persist the updated dicts to disk
        models_dir = os.path.join(os.path.dirname(__file__), "ml/models")
        os.makedirs(models_dir, exist_ok=True)
        with open(os.path.join(models_dir, "scalers.pkl"), "wb") as f:
            pickle.dump(scalers, f)
        with open(os.path.join(models_dir, "iso_forests.pkl"), "wb") as f:
            pickle.dump(iso_forests, f)

        return Response(
            {"message": f"Retrained {1 if cid else len(scalers)} model(s)."},
            status=status.HTTP_200_OK,
        )

class PostingsListView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostingsSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ("accountant", "customer"):
            qs = Postings.objects.filter(company__in=user.companies.all())
        else:
            qs = Postings.objects.all()

        company_id = self.request.query_params.get("company")
        if company_id:
            qs = qs.filter(company_id=company_id)
        return qs

class PostingsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Postings.objects.all()
    serializer_class = PostingsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ("accountant", "customer"):
            return Postings.objects.filter(company__in=user.companies.all())
        return super().get_queryset()

class CompanyListCreateView(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

class CompanyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

class CustomerListCreateView(generics.ListCreateAPIView):
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "accountant":
            return User.objects.filter(
                role="customer", companies__in=user.companies.all()
            )
        if user.role == "superuser":
            return User.objects.filter(role="customer")
        return User.objects.none()
    
class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "accountant":
            return User.objects.filter(
                role="customer", companies__in=user.companies.all()
            )
        if user.role == "superuser":
            return User.objects.filter(role="customer")
        return User.objects.none()
    
class AccountantListCreateView(generics.ListCreateAPIView):
    serializer_class = AccountantSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "superuser":
            return User.objects.filter(role="accountant")
        return User.objects.filter(id=user.id, role="accountant")
    
class AccountantDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AccountantSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "superuser":
            return User.objects.filter(role="accountant")
        return User.objects.filter(id=user.id, role="accountant")

@require_POST
def login_view(request):
    data = json.loads(request.body)
    identifier = data.get("email")
    password = data.get("password")
    if not identifier or not password:
        return JsonResponse({"error": "Username (or email) and password are required."}, status=400)

    User = get_user_model()
    try:
        user_obj = User.objects.get(username=identifier)
    except User.DoesNotExist:
        try:
            user_obj = User.objects.get(email=identifier)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid username or password."}, status=401)

    user = authenticate(request, username=user_obj.username, password=password)
    if not user:
        return JsonResponse({"error": "Invalid username or password."}, status=401)

    login(request, user)
    return JsonResponse({"message": "Login successful."}, status=200)

def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User is not logged in."}, status=401)
    logout(request)
    return JsonResponse({"message": "Logout successful."}, status=200)

@login_required
def get_user_details(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False}, status=401)

    user = request.user
    user_data = {
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "companies": [
            {"id": c.id, "companyName": c.companyName}
            for c in user.companies.all()
        ],
    }
    return JsonResponse({"isAuthenticated": True, "user": user_data}, status=200)

@ensure_csrf_cookie
def set_csrf_cookie(request):
    return JsonResponse({"csrfToken": request.META.get("CSRF_COOKIE")}, status=200)

@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False}, status=401)
    return JsonResponse({"isAuthenticated": True, "user": {"email": request.user.username}}, status=200)

def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False}, status=401)
    return JsonResponse({"user": {"email": request.user.username}}, status=200)

