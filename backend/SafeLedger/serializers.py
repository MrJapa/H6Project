from rest_framework import serializers
from .models import User, Postings, Company

class PostingsSerializer(serializers.ModelSerializer):
    postDate = serializers.DateField(format="%d-%m-%Y")
    class Meta:
        model = Postings
        fields = '__all__'

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'companyName']

    def validate_companyName(self, value):
        if Company.objects.filter(companyName=value).exists():
            raise serializers.ValidationError("Company with this name already exists.")
        return value