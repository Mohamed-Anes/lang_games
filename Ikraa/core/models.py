from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


# class Word(models.Model):
#     word = models.CharField(max_length=100)
#     definition = models.TextField()
#     example_sentence = models.TextField()

#     def __str__(self):
#         return self.word


categories_dict = {
    'literature': 'l',
    'religions': 'r',
    'economics': 'e',
    'history': 'h',
    'technology': 't',
    'novels': 'n',
    'politics': 'p',
    'poetry': 'o',
    'health': 'a',
    'psychology': 'c',
    'phylosophy': 'y',
    'arts': 'f',
    'children.stories': 'd',
    'plays': 'g',
    'primaire': 'x',
    'moyenne': 'z',
    'secondaire': 'w'
}


class Lemme(models.Model):
    lemme = models.CharField(max_length=15)
    freq_brute = models.IntegerField()
    freq_relative = models.DecimalField(max_digits=12, decimal_places=10)
    # synonyme + antonyme sont clé étrangere
    synonymes = models.ManyToManyField(to="self", related_name="synonymes")
    synonymes_valides = models.ManyToManyField(
        to="self", related_name="synonymes")
    antonymes = models.ManyToManyField(to="self", related_name="antonymes")
    antonymes_valides = models.ManyToManyField(
        to="self", related_name="antonymes")

    rank = models.BigIntegerField(null=True)

    # definition = models.OneToOneField(to="Definition", null=True, on_delete=models.SET_NULL)

    niveau = models.ForeignKey(
        to="Niveau", null=True, on_delete=models.SET_NULL)
    niveau2 = models.IntegerField(default=0, null=True)
    categories = models.CharField(max_length=17)

    syn_texte = models.TextField(null=True)
    ant_texte = models.TextField(null=True)

    def __str__(self):
        return self.lemme

    def get_categories(self):
        return [cat for code, cat in categories_dict.items() if code in self.categories]

    class Meta:
        indexes = [
            models.Index(fields=['lemme',]),
            models.Index(fields=['id',]),
        ]

    def get_texte_syn(self):
        return self.syn_texte

    def get_texte_ant(self):
        return self.ant_texte


class Mot(models.Model):
    mot = models.CharField(max_length=15)
    analyse_morph = models.TextField(null=True)
    est_valide = models.BooleanField(default=False)
    lemma = models.ForeignKey(to=Lemme, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.mot


class Niveau(models.Model):
    nom = models.CharField(max_length=30)
    difficulte = models.IntegerField(null=True)
    age_recommande = models.IntegerField(null=True)

    def __str__(self):
        return self.nom


class Definition(models.Model):
    definition = models.TextField(null=True)
    est_valide = models.BooleanField(default=False)
    lemme = models.ForeignKey(to=Lemme, on_delete=models.CASCADE, null=True)


class Example(models.Model):
    example = models.TextField(null=True)
    est_valide = models.BooleanField(default=False)
    lemma = models.ForeignKey(to=Lemme, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.example


class temps_conj(models.TextChoices):
    PASSE = 'A', ('الماضي')
    PRESENT = 'B', ('المضارع')
    SUBJONCTIF = 'C', ('المضارع المنصوب')
    PASSE_PASSIF = 'D', ('الماضي المبني للمجهول')
    PRESENT_PASSIF = 'E', ('المضارع المبني للمجهول')
    JUSSIF = 'F', ('المضارع المجزوم')
    IMPERATIF = 'G', ('الأمر')


class conjugaison(models.Model):
    lemme = models.ForeignKey(to=Lemme, on_delete=models.CASCADE, null=True)
    est_valide = models.BooleanField(default=False)
    texte = models.TextField(null=True)
    prnm_je = models.CharField(max_length=30, null=True)
    prnm_nous = models.CharField(max_length=30, null=True)
    prnm_tu_M = models.CharField(max_length=30, null=True)
    prnm_tu_F = models.CharField(max_length=30, null=True)
    prnm_vous_2M = models.CharField(max_length=30, null=True)
    prnm_vous_PM = models.CharField(max_length=30, null=True)
    prnm_vous_PF = models.CharField(max_length=30, null=True)
    prnm_il = models.CharField(max_length=30, null=True)
    prnm_elle = models.CharField(max_length=30, null=True)
    prnm_ils_2 = models.CharField(max_length=30, null=True)
    prnm_ils_P = models.CharField(max_length=30, null=True)
    prnm_elles_P = models.CharField(max_length=30, null=True)

    temps = models.CharField(
        max_length=1,
        choices=temps_conj.choices,
        null=True
    )

    def get_temps(self) -> temps_conj:
        # Get value from choices enum
        return temps_conj[self.temps]

    # def __str__(self):
    #     return self.lemme + " : " + self.get_temps()

    def get_table(self):
        return [
            self.prnm_je,
            self.prnm_nous,
            self.prnm_tu_M,
            self.prnm_tu_F,
            self.prnm_vous_2M,
            self.prnm_vous_PM,
            self.prnm_vous_PF,
            self.prnm_il,
            self.prnm_elle,
            self.prnm_ils_2,
            self.prnm_ils_P,
            self.prnm_elles_P,
        ]

    def get_texte(self):
        return self.texte
