from django.contrib.auth import get_user_model
User = get_user_model()

user = User.objects.get(username='Test')
user.set_password('Test1')
user.save()