from django.db import models

# Create your models here.
class Company(models.Model):
    id = models.IntegerField(primary_key=True)
    companyName = models.CharField(max_length=100)

    def __str__(self):
        return self.companyName
    
class User(models.Model):
    id = models.IntegerField(primary_key=True)
    userName = models.CharField(max_length=100)
    userEmail = models.EmailField(max_length=100)
    userPassword = models.CharField(max_length=100)
    companyId = models.ForeignKey(Company, on_delete=models.CASCADE)

    def __str__(self):
        return self.userName
    
class Postings(models.Model):
    id = models.IntegerField(primary_key=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    accountHandleNumber = models.IntegerField()
    postDate = models.DateField()
    postAmount = models.DecimalField(max_digits=15, decimal_places=2)
    postCurrency = models.CharField(max_length=100)
    postDescription = models.CharField(max_length=100)

    def __str__(self):
        return str(self.id)