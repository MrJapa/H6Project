#backend/SafeLedger/admin.py
from django.contrib import admin
from .models import User, Company, Postings

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role')
    list_filter = ('role',)
    search_fields = ('username', 'email')
    filter_horizontal = ('companies',)

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('companyName',)
    search_fields = ('companyName',)

@admin.register(Postings)
class PostingsAdmin(admin.ModelAdmin):
    list_display = ('id', 'company', 'accountHandleNumber', 'postDate', 'postAmount', 'postCurrency', 'postDescription')
    list_filter = ('company', 'postDate')
    search_fields = ('postDescription',)
    date_hierarchy = 'postDate'

# Register your models here.
