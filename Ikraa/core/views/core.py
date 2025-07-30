from django.http import HttpResponse
from ..forms import CustomUserCreationForm
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from ..models import User, Lemme, Mot, Definition, Example, conjugaison


def test_tw(request):
    return render(request, 'text_evaluation.html')


def home(request):
    return render(request, 'home.html')


def signup(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = CustomUserCreationForm()
    return render(request, 'signup.html', {'form': form})


def user_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('assessment')
            else:
                error = 'Invalid username or password.'
        else:
            error = 'Invalid username or password.'
    else:
        form = AuthenticationForm()
        error = None

    return render(request, 'login.html', {'form': form, 'error': error})


# FUNCTIONS FOR LOADING THE DICTIONARY
def testerrorword(word):
    t = list(word)
    if ('ة' in t[0:-4]):
        return False
    return True


def supprimer_lettres_repetees(chaine):

    chars = list(chaine)
    unique_chars = []
    for char in chars:
        if char not in unique_chars:
            unique_chars.append(char)
    return ''.join(unique_chars)


def list_son_repetion(lst):

    duplicates = []
    for i in range(len(lst)):
        if not (lst[i] in duplicates):
            duplicates.append(lst[i])
    return duplicates


def insert_words(request):

    import xml.etree.ElementTree as xml
    import os
    import json

    dict_file = os.path.join('static', 'finale_module3.xml')

    # Getting the data from xml file - DONE ONCE -
    tree = xml.parse(dict_file)
    root = tree.getroot()
    words = root.findall('word')

    dict_word_counts = {}
    dict_frequency_moy = {}
    dict_familleMorphologique = {}
    dict_nbdocument = {}
    dict_frequency = {}
    dict_categorie = {}

    i = 0
    longest = 0

    simply_words = []

    for word in words:
        value = word.get('value')
        frequency = int(word.get('frequency'))
        nb_document_appart = int(word.get('nb_document_appart'))
        famille_Morphologique = word.get('famille_Morphologique')
        frequency_moy = float(word.get('frequency_moy'))
        list_frequency = word.get('list_frequency')
        categorie = word.get('catégorie')

        niv = len(categorie)
        if niv == 1 and nb_document_appart == 1 and len(famille_Morphologique) == 1:
            continue
        else:
            simply_words.append(value)

        list_frequency = ''.join(
            c for c in list_frequency if c not in ['[', ']', "'", ' '])
        list_frequency = list_frequency.split(",")
        famille_Morphologique = ''.join(
            c for c in famille_Morphologique if c not in ['[', ']', "'", ' '])
        famille_Morphologique = famille_Morphologique.split(",")

        if (len(value) > 17 or testerrorword(value) == False):  # error
            i += 1
        else:
            if len(value) > longest:
                longest = len(value)
            dict_frequency_moy[value] = dict_frequency_moy.get(
                value, 0) + frequency_moy
            dict_categorie[value] = supprimer_lettres_repetees(
                dict_categorie.get(value, "") + categorie)
            dict_frequency[value] = dict_frequency.get(
                value, []) + list_frequency
            dict_word_counts[value] = dict_word_counts.get(
                value, 0) + frequency
    #             nb_mots += frequency
    #             nb_moy_norm+=frequency_moy

            dict_familleMorphologique[value] = list_son_repetion(
                dict_familleMorphologique.get(value, []) + famille_Morphologique)
            dict_nbdocument[value] = dict_nbdocument.get(
                value, 0) + nb_document_appart

    print("good words : ", len(dict_frequency_moy))
    print("wrong words : ", i)
    print("longest : ", longest)

    i = 0
    j = 0
    nums = 0

    # instantiating lists for bulk creation
    lemmes = []
    mots = []
    dfnts = []
    exmpls = []
    cnjgs = []

    # sort by the relative frequency (sub_difficulty)
    print("-- currently sorting --")
    try:
        simply_words = sorted(simply_words, key=lambda obj: (
            len(dict_categorie.get(obj, "")) + dict_frequency_moy.get(obj, 0)))
    except Exception as e:
        print("error : ", e)
    ranking = 0

    print("-- finished sorting --")

    # for lem, freq in dict_word_counts.items():
    for lem in simply_words:
        try:
            niv = len(dict_categorie[lem])
            if niv == 1 and dict_nbdocument[lem] == 1 and len(dict_familleMorphologique[lem]) == 1:
                niv = 0
                nums += 1
                continue

            i += 1
            j += 1

            # print(i, " ", j)
            # creation de lemmas
            lemme_object = Lemme(
                lemme=lem[0:-2],
                freq_brute=dict_word_counts[lem],
                freq_relative=dict_frequency_moy[lem],
                # niveau=Niveau.objects.get(nom=str(len(dict_categorie[lem]))),
                niveau2=niv,
                categories=dict_categorie[lem],
                rank=ranking
            )
            ranking += 1
            # lemme_object.save()
            lemmes.append(lemme_object)

            # creation de famille morphologique
            for mot in dict_familleMorphologique[lem]:
                mot_object = Mot(
                    mot=mot,
                    lemma=lemme_object,
                )
                # mot_object.save()
                mots.append(mot_object)

            if j > 500:
                j = 0

                Lemme.objects.bulk_create(lemmes)
                Mot.objects.bulk_create(mots)
                print("\n\n\n --------- bulk created ", i, " ---------\n\n\n")
                lemmes = []
                mots = []
        except Exception as e:
            print(e)
            continue

            # creation de définitions

            # creation des examples
    print('nums of 0 niveau : ', nums)

    return HttpResponse("hello world")
