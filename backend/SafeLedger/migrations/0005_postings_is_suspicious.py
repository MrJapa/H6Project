# Generated by Django 4.2.14 on 2025-04-22 12:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SafeLedger', '0004_alter_company_companyname'),
    ]

    operations = [
        migrations.AddField(
            model_name='postings',
            name='is_suspicious',
            field=models.BooleanField(default=False),
        ),
    ]
