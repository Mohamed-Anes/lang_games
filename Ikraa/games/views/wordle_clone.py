from django.shortcuts import render
import random
from django.http import JsonResponse
from core.models import Lemme
from django.db.models.functions import Length


# 274047 lemmes in total
def wordle(request):
    # words = Lemme.objects.filter(lemme='تمرين')
    words = Lemme.objects.filter(rank__gte=265047).annotate(
        text_len=Length('lemme')).filter(text_len=5)

    if len(words) == 0:
        print('error empty list')

    rand_id = int(random.random() * len(words))
    word = words[rand_id]
    request.session['word'] = word.lemme
    return render(request, 'wordle_clone.html', {'word': word.lemme})


def check_word(request):
    if request.method == 'GET':
        sent_word = request.GET['word']
        right_word = request.session['word']
        # 0 : letter does not appear in word, 1 : letter in wrong place, 2 : letter in right place
        are_letters = [0, 0, 0, 0, 0]
        is_word = True

        for i in range(5):
            if sent_word[i] == right_word[i]:
                are_letters[i] = 2
            elif sent_word[i] in right_word:
                are_letters[i] = 1

        # for i in range(5):
        #     if sent_word[i] == right_word[i]:
        #         are_letters.append(True)
        #     else:
        #         are_letters.append(False)

        if False in are_letters:
            is_word = False

        response = {
            'is_word': is_word,
            'are_letters': are_letters,
            'sent_word': request.GET['word'],
            'right_word': request.session['word'],
        }

    return JsonResponse(response)
