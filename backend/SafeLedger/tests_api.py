# backend/SafeLedger/tests_api.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from .models import Company, User, Postings
from .ml.ml_model import scalers, iso_forests
import numpy as np

class BaseAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Users
        self.superuser = User.objects.create_user(
            username='admin', email='admin@test.dk',
            password='admin123', role='superuser'
        )
        self.accountant = User.objects.create_user(
            username='acct', email='acct@test.dk',
            password='acct123', role='accountant'
        )

        self.company = Company.objects.create(companyName='TestCo')
        self.accountant.companies.add(self.company)

        # Patch ML model for postings
        class DummyScaler:
            def transform(self, X):
                return X
        class DummyIso:
            def predict(self, X):
                return np.array([-1])
        scalers[self.company.id] = DummyScaler()
        iso_forests[self.company.id] = DummyIso()

class CompanyAPITest(BaseAPITest):
    def test_create_company(self):
        print("[CompanyAPITest] test_create_company")
        self.client.force_authenticate(self.superuser)
        url = reverse('companies-list')
        data = {'companyName': 'NewCo'}
        response = self.client.post(url, data, format='json')
        print("Status code:", response.status_code, "Data:", response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_duplicate_company(self):
        print("[CompanyAPITest] test_duplicate_company")
        self.client.force_authenticate(self.superuser)
        Company.objects.create(companyName='DupCo')
        url = reverse('companies-list')
        response = self.client.post(url, {'companyName': 'DupCo'}, format='json')
        print("Status code:", response.status_code, "Data:", response.data)
        # Intentional failure: expecting 200 but will get 400
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class CustomerAPITest(BaseAPITest):
    def test_create_customer(self):
        print("[CustomerAPITest] test_create_customer")
        self.client.force_authenticate(self.accountant)
        url = reverse('customers-list')
        data = {
            'first_name': 'Jacob',
            'last_name': 'Vinther',
            'username': 'JacobVinther',
            'email': 'john@example.com',
            'password': 'password123',
            'company': self.company.id,
        }
        response = self.client.post(url, data, format='json')
        print("Status code:", response.status_code, "Data:", response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_duplicate_customer(self):
        print("[CustomerAPITest] test_duplicate_customer")
        self.client.force_authenticate(self.accountant)
        # create first customer
        data = {
            'first_name': 'Jacob',
            'last_name': 'Japa',
            'username': 'JacobJapa',
            'email': 'jacob@japa.com',
            'password': 'password123',
            'company': self.company.id,
        }
        resp1 = self.client.post(reverse('customers-list'), data, format='json')
        print("First create ->", resp1.status_code, resp1.data)
        # duplicate
        resp2 = self.client.post(reverse('customers-list'), data, format='json')
        print("Second create ->", resp2.status_code, resp2.data)
        # Intentional failure: expecting 201 but will get 400
        self.assertEqual(resp2.status_code, status.HTTP_201_CREATED)

class AccountantAPITest(BaseAPITest):
    def test_create_accountant(self):
        print("[AccountantAPITest] test_create_accountant")
        self.client.force_authenticate(self.superuser)
        url = reverse('accountants-list')
        data = {
            'username': 'acct2',
            'email': 'acct2@example.com',
            'first_name': 'A',
            'last_name': 'B',
            'password': 'pass123',
            'companies': [self.company.id],
        }
        response = self.client.post(url, data, format='json')
        print("Status code:", response.status_code, "Data:", response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_accountants_for_superuser(self):
        print("[AccountantAPITest] test_list_accountants_for_superuser")
        self.client.force_authenticate(self.superuser)
        acc1 = User.objects.create_user(username='a1', email='a1@test.dk', password='pw', role='accountant')
        acc1.companies.add(self.company)
        acc2 = User.objects.create_user(username='a2', email='a2@test.dk', password='pw', role='accountant')
        url = reverse('accountants-list')
        response = self.client.get(url)
        print("Status code:", response.status_code, "Data:", response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Intentional failure: assert wrong len
        self.assertEqual(len(response.data), 0)

class PostingAPITest(BaseAPITest):
    def test_create_posting_sets_suspicious(self):
        print("[PostingAPITest] test_create_posting_sets_suspicious")
        self.client.force_authenticate(self.accountant)
        url = reverse('postings-list')
        data = {
            'company': self.company.id,
            'accountHandleNumber': 1001,
            'postDate': '2025-04-20',
            'postAmount': '10000000',
            'postCurrency': 'DKK',
            'postDescription': 'Test posting',
        }
        response = self.client.post(url, data, format='json')
        print("Status code:", response.status_code, "Data:", response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Intentional failure: expect is_suspicious False
        self.assertFalse(response.data.get('is_suspicious'))

# Intentional failing unit test
class IntentionalFailureTest(BaseAPITest):
    def test_will_fail(self):
        print("[IntentionalFailureTest] This test is designed to fail")
        self.assertEqual(1, 2, "Intentional failure to demonstrate test failures")
