# backend/SafeLedger/views.py
import json
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.views.decorators.http import require_POST

from .models import Postings, Company
from .serializers import PostingsSerializer, CompanySerializer

class PostingsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # base queryset depending on role
        if user.role in ("accountant", "customer"):
            qs = Postings.objects.filter(company__in=user.companies.all())
        else:
            qs = Postings.objects.all()

        # optional filter by query‑param
        company_id = request.query_params.get("company")
        if company_id:
            qs = qs.filter(company_id=company_id)

        serializer = PostingsSerializer(qs, many=True)
        return Response(serializer.data)

class CompanyListCreateView(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]


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
