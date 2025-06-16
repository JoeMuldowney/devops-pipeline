import json
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect, csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from django.core.paginator import Paginator
from .models import Book, Author



@require_GET
@csrf_exempt
def category_search(request, genre):


        books = Book.objects.filter(genre=genre)
        paginator = Paginator(books, 4)

        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        serialized_books = list(page_obj.object_list.values())

        # Return the list of book details as JSON response
        return JsonResponse(
            {'books': serialized_books, 'page_number': page_obj.number, 'total_pages': paginator.num_pages})


@require_GET
@csrf_exempt
def view_book(request, bookId):

    try:
        book = Book.objects.get(id=bookId)

        if book.author_id:
            author = Author.objects.get(id=book.author_id)
            author_name = author.name

        return JsonResponse({'book': {
            'id': book.id,
            'title': book.title,
            'book_description': book.book_description,
            'author': author_name,
            'genre': book.genre,
            'buy_amount': book.buy_amount,
            'rent_amount': book.rent_amount
            }})
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Book not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

