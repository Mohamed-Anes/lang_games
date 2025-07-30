from django.urls import path
from .views import core

urlpatterns = [
    # path('test_tw', core.test_tw, name='test_tw'),
    path('home', core.home, name='home'),
    # Signup and login URLs
    path('signup/', core.signup, name='signup'),
    path('login/', core.user_login, name='login'),

    # Temp for loading words for first time
    path('load', core.insert_words, name='load'),
]
