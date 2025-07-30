from django.shortcuts import render
import random
from django.http import JsonResponse
from core.models import Mot
import json
from django.views.decorators.csrf import csrf_exempt


# 274047 lemmes in total
def scrabble(request):

    return render(request, 'scrabble_clone.html')


@csrf_exempt
def check_words(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        result = []

        # print(data)
        for word in data["words"]:
            # print(word)
            temp = Mot.objects.filter(mot=word)
            # print(temp)
            result.append(temp)

        response = {
            "are_true": False,
            "wrong_words": [],
        }

    else:
        response = {}

    return JsonResponse(response)
