from django.db import models

# Create your models here.
class Company(models.Model):
    companyId = models.CharField(primary_key=True, max_length=256)
    companyName = models.CharField(max_length=100)
    companyVat = models.IntegerField(null=True)

    def __str__(self):
        return self.companyName
    
class User(models.Model):
    userId = models.IntegerField(primary_key=True)
    userName = models.CharField(max_length=100)
    userEmail = models.EmailField(max_length=100)
    userPassword = models.CharField(max_length=100)
    companyId = models.ForeignKey(Company, on_delete=models.CASCADE)

    def __str__(self):
        return self.userName
    
class Transaction(models.Model):
    transactionId = models.CharField(max_length=256)
    companyId = models.ForeignKey(Company, on_delete=models.CASCADE)
    accountHandleNumber = models.CharField(max_length=10)
    transactionDate = models.DateField()
    transactionAmount = models.DecimalField(max_digits=10, decimal_places=2)
    transactionCurrency = models.CharField(max_length=100)
    transactionDescription = models.CharField(max_length=100)

    def __str__(self):
        return self.transactionAmount