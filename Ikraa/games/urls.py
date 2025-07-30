from django.urls import path
from .views import wordle_clone, scrabble_clone

urlpatterns = [
    # Wordle
    path('/wordle', wordle_clone.wordle, name='wordle'),
    path('/wordle/check_word', wordle_clone.check_word, name='check_word'),
    # Scrabble
    path('/scrabble', scrabble_clone.scrabble, name='scrabble'),
    path('/scrabble/check_words', scrabble_clone.check_words, name='check_words'),
]
