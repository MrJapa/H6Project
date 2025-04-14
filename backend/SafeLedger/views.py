from django.shortcuts import render
from rest_framework import generics
from .models import User, Postings, Company
from .serializers import PostingsSerializer
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

class PostingsListView(generics.ListCreateAPIView):
    queryset = Postings.objects.all()
    serializer_class = PostingsSerializer

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, username=email, password=password)
    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# Create your views here.
