from django import forms
from .models import User


from django.contrib.auth.forms import UserCreationForm


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        # Add any additional fields you want to include in the signup form
        fields = ('username', 'email')
