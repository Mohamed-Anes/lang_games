from django.contrib import admin

# Register your models here.

from .models import User, Lemme, Mot

admin.site.register(User)
admin.site.register(Lemme)
admin.site.register(Mot)
