from rest_framework import serializers
from .models import User, Postings, Company
from .ml.ml_model import evaluate_posting

class PostingsSerializer(serializers.ModelSerializer):
    postDate = serializers.DateField(format="%d-%m-%Y")
    is_suspicious = serializers.BooleanField(read_only=True)
    class Meta:
        model = Postings
        fields = [
            'id',
            'company',
            'accountHandleNumber',
            'postDate',
            'postAmount',
            'postCurrency',
            'postDescription',
            'is_suspicious',
        ]

    def create(self, validated_data):
        posting = Postings.objects.create(**validated_data)

        data = {
            'company_id': posting.company.id,
            'accountHandleNumber': posting.accountHandleNumber,
            'postAmount': float(posting.postAmount),
        }
        posting.is_suspicious = evaluate_posting(data)

        posting.save()
        return posting

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
    
    company_name = serializers.SerializerMethodField(read_only=True)

    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        #fields = ['id', 'first_name', 'last_name', 'email', 'username', 'company', 'password']
        fields = [
            'id', 'first_name', 'last_name',
            'email', 'username',
            'company',          # write-only for post/patch
            'company_name',     # read-only for get
            'password',
        ]

    def get_company_name(self, obj):
        first = obj.companies.first()
        return first.companyName if first else None

    def validate_username(self, value):
        # if User.objects.filter(username=value).exists():      CHANGED BECAUSE OF UNIQUE CONSTRAINT
        #     raise serializers.ValidationError("Username already exists.")
        qs = User.objects.filter(username=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Username already exists.")
        return value
    
    def validate_email(self, value):
        # if User.objects.filter(email=value).exists():     CHANGED BECAUSE OF UNIQUE CONSTRAINT
        #     raise serializers.ValidationError("Email already exists.")
        qs = User.objects.filter(email=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
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

class AccountantSerializer(serializers.ModelSerializer):
    companies = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(), many=True, write_only=True
    )
    password = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'password',
            'companies',
        ]
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value
    
    def create(self, validated_data):
        company_list = validated_data.pop('companies')
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')

        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=first_name,
            last_name=last_name,
            role='accountant',
        )
        user.set_password(password)
        user.save()
        user.companies.set(company_list)
        return user
    