from rest_framework import serializers
from .models import User, Postings, Company

class PostingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Postings
        fields = '__all__'