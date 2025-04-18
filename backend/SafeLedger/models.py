#backend/SafeLedger/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Company(models.Model):
    #id = models.IntegerField(primary_key=True) //Django automatically creates an id field as primary key
    companyName = models.CharField(max_length=225, unique=True)

    def __str__(self):
        return self.companyName
    
class User(AbstractUser):
    ROLE_CHOICES = [
        ('accountant', 'Accountant'),
        ('customer', 'Customer'),
        ('superuser', 'Superuser'),
    ]

    companies = models.ManyToManyField(Company)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')

    REQUIRED_FIELDS = ['email']  # Add required fields for creating a superuser

    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"
    
class Postings(models.Model):
    #id = models.IntegerField(primary_key=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    accountHandleNumber = models.IntegerField()
    postDate = models.DateField()
    postAmount = models.DecimalField(max_digits=15, decimal_places=2)
    postCurrency = models.CharField(max_length=100)
    postDescription = models.CharField(max_length=100)

    def __str__(self):
        return str(self.id)