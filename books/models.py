from django.db import models

class Author(models.Model):
    name = models.CharField(max_length=65, null=True)

    def __str__(self):
        return self.name

    class Meta:
        app_label = 'books'

class Book(models.Model):
        author = models.ForeignKey(Author, on_delete=models.CASCADE)
        book_description = models.TextField(max_length=1000)
        title = models.CharField(max_length=225)
        genre = models.CharField(max_length=25, null=True)
        stock = models.IntegerField()
        buy_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True)
        rent_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True)


class Review(models.Model):
    review = models.ForeignKey(Book, on_delete=models.CASCADE)
    rating = models.TextField(max_length=225)
