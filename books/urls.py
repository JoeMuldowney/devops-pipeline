
from django.urls import path
from . import views

urlpatterns = [
    path("category/<str:genre>/", views.category_search, name="category"),
    path("view/<int:bookId>/", views.view_book, name="bookview"),

]