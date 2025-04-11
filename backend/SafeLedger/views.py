from django.shortcuts import render
from rest_framework import generics
from .models import User, Postings, Company
from .serializers import PostingsSerializer

class PostingsListView(generics.ListCreateAPIView):
    queryset = Postings.objects.all()
    serializer_class = PostingsSerializer

# Create your views here.
