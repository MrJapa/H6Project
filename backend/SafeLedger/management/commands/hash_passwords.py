from django.core.management.base import BaseCommand
from SafeLedger.models import User
from django.contrib.auth.hashers import make_password

class Command(BaseCommand):
    help = 'Hash plain-text passwords for all users'

    def handle(self, *args, **kwargs):
        users = User.objects.all()
        for user in users:
            if not user.userPassword.startswith('pbkdf2_'):  # Check if the password is already hashed
                self.stdout.write(f"Hashing password for user: {user.userName}")
                user.userPassword = make_password(user.userPassword)
                user.save()
        self.stdout.write(self.style.SUCCESS('Successfully hashed all plain-text passwords!'))