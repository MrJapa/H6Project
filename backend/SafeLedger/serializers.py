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
    
class CustomerSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(), write_only=True)
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'company', 'password']

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value
    
    def create(self, validated_data):
        company = validated_data.pop('company')
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')

        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            role='customer',
            first_name=first_name,
            last_name=last_name,
        )

        user.set_password(password)
        user.save()

        user.companies.add(company)
        return user

