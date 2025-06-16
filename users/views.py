import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db.models.functions import Extract
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.views.decorators.http import require_POST, require_GET, require_http_methods
from .models import MemberProfile, SaveBook, Purchase
from books.models import Book
from books.models import Author




@csrf_exempt
@require_POST
def membership(request):
    data = json.loads(request.body)

    username = data.get('username')
    email = data.get('email')
    password1 = data.get('password1')
    password2 = data.get('password2')
    first_name = data.get('firstname')
    last_name = data.get('lastname')
    # confirm password and insert a user object
    if password1 != password2:
        return JsonResponse({'success': False},status=401)
    else:
        user = User.objects.create_user(
            username=username, email=email, password=password1, first_name=first_name, last_name=last_name)
        login_user = authenticate(username=username, password=password1)
        login(request, login_user, backend=None)
        return JsonResponse({'success': True, 'user_id': login_user.id}, status=202)

@csrf_exempt
@require_http_methods(["PATCH"])
def account_email_patch(request):
    data = json.loads(request.body)
    if request.user.is_authenticated:
        user = request.user
        email = data.get('email')
        try:
            user.email = email
            user.save()
            return JsonResponse({'success': 'Email updated successfully'})
        except Exception as e:
            return JsonResponse({'Error': str(e)})
    else:
        return JsonResponse({'error': 'User Not logged In'}, status=404)


@require_POST
@csrf_exempt
def member_login(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    if username is None or password is None:
        return JsonResponse({"Error": "You must fill out username and password fields"}, status=400)
    # if user exists log in
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user, backend=None)
        return JsonResponse({'success': True},status=202)
    else:
        return JsonResponse({"Error": "invalid credentials"}, status=400)


@csrf_exempt
@require_GET
def log_status(request):
    if request.user.is_authenticated:
        user = request.user
        return JsonResponse({'is_authenticated': True, 'user_id':user.id},status=200)
    else:
        return JsonResponse({'is_authenticated': False},status=401)


@csrf_exempt
@require_POST
def member_logout(request):

    if request.user.is_authenticated:
        # log user out
        logout(request)
        return JsonResponse({'success': True}, status=202)
    else:
        return JsonResponse({'Error': "Not logged in"}, status=401)


@csrf_exempt
@login_required
@require_POST
def create_member_profile(request):
    data = json.loads(request.body)

    profile_description = data.get('profileDesc', None)
    fav_book = data.get('favoriteBook', None)
    cur_book = data.get('currentBook', None)
    fav_author = data.get('favoriteAuthor', None)
    fav_genres = data.get('favoriteGenre',None)
    public = data.get('publicProfile', False)

    if data is None:
        return JsonResponse({"Error": "No fields are field out"}, status=400)

    try:
        # Get the current user
        user = request.user
        profile=MemberProfile( user=user,
            profile_description=profile_description, fav_book=fav_book, cur_book=cur_book, fav_author=fav_author, fav_genres=fav_genres, public=public
        )
        profile.save()
        return JsonResponse({'success': True},status=202)
    except Exception as e:
        return JsonResponse({'Error': str(e)})


@login_required
@require_GET
@csrf_protect
def member_profile(request):
    if request.user.is_authenticated:
        user = request.user
        try:
            member_profile = MemberProfile.objects.get(user=user)
            data = {
            'profileDesc': member_profile.profile_description,
            'favoriteBook': member_profile.fav_book,
            'currentBook': member_profile.cur_book,
            'favoriteAuthor': member_profile.fav_author,
            'favoriteGenre': member_profile.fav_genres,
            'publicProfile': member_profile.public
            }
            return JsonResponse(data)
        except MemberProfile:
            return JsonResponse({'error': 'Member profile does not exist'}, status=404)
    else:
        return JsonResponse({'error': 'User not logged in'}, status=400)


@require_GET
@csrf_protect
@login_required
def member_account(request):
    if request.user.is_authenticated:
        user = request.user

        try:
            member = User.objects.get(username=user)

            day = Extract('date_joined', 'day')
            month = Extract('date_joined', 'month')
            year = Extract('date_joined', 'year')

            return JsonResponse({
                'first_name': member.first_name,
                'last_name': member.last_name,
                'username': member.username,
                'email': member.email,
                'member_since': {
                    'day': member.date_joined.day,
                    'month': member.date_joined.month,
                    'year': member.date_joined.year
                }
            },status=201)
        except:
            return JsonResponse({'error': 'User account does not exist'}, status=404)
    else:
        return JsonResponse({'error': 'User not logged in'}, status=400)

@csrf_exempt
@login_required
@require_POST
def save_book(request, id):
    if request.user.is_authenticated:
        book = Book.objects.get(id=id)
        author_name = Author.objects.get(id=book.author_id)
        try:

            user = request.user
            book_list=SaveBook(
            title=book.title, author=author_name.name, book=book.id, user_id=user.id
            )
            book_list.save()
            return JsonResponse({'success': True},status=200)
        except Exception as e:
            return JsonResponse({'Error': str(e)})
    else:
        return JsonResponse({'error': 'User not logged in'}, status=400)

@csrf_exempt
@login_required
@require_POST
def purchase(request):
    if request.user.is_authenticated:
        data = json.loads(request.body)
        book_ids = [item.get('book_id') for item in data]
        user = request.user
        try:
            for book in book_ids:
                book = Book.objects.get(id=book)
                author_name = Author.objects.get(id=book.author_id)

                bought = Purchase(
                    title=book.title,
                    author=author_name.name,
                    book=book.id,
                    user_id=user.id
                )
                bought.save()
            return JsonResponse({'success': True}, status=200)
        except Exception as e:
            return JsonResponse({'Error': str(e)})
    else:
        return JsonResponse({'error': 'User not logged in'}, status=400)

@require_GET
@csrf_exempt
@login_required()
def purchase_history(request):
    if request.user.is_authenticated:

        try:
            user = request.user
            books = Purchase.objects.filter(user_id=user.id)
            books_arr = []

            for book in books:
                books_arr.append({
                    'id': book.id,
                    'title': book.title,
                    'author': book.author,
                    'book': book.book
                })

        # Return the list of book details as JSON response
            return JsonResponse({'books': books_arr},status=201)
        except:
            return JsonResponse({'error': 'Book does not exist in list'}, status=404)
    else:
        return JsonResponse({'error': 'User not logged in'}, status=400)

@require_GET
@login_required
@csrf_exempt
def book_status(request, id):
    if request.user.is_authenticated:
        try:
            user = request.user
            saved_book = SaveBook.objects.get(user_id=user.id, book=id)
            if saved_book:
                return JsonResponse({'success': True}, status=201)
            else:
                return JsonResponse({'success': False})
        except Exception as e:
            return JsonResponse({'Error': str(e)})

    else:
        return JsonResponse({'error': 'User not logged in'}, status=400)
@require_GET
@csrf_exempt
@login_required()
def saved_books_list(request):
    if request.user.is_authenticated:
        try:
            user = request.user
            books = SaveBook.objects.filter(user=user.id)
            books_arr = []

        # Iterate over each book to extract its details
            for book in books:
                books_arr.append({
                    'id': book.id,
                    'title': book.title,
                    'author': book.author,
                    'book': book.book
                })

        # Return the list of book details as JSON response
            return JsonResponse({'books': books_arr},status=201)
        except:
            return JsonResponse({'error': 'Book does not exist in list'}, status=404)
    else:
        return JsonResponse({'error': 'User not logged in'}, status=400)

@require_http_methods(["DELETE"])
@csrf_exempt
@login_required()
def delete_book(request, id):

    if request.user.is_authenticated:
        try:
            user = request.user
            book = SaveBook.objects.get(book=id,user_id=user.id)
            book.delete()

            return JsonResponse({'success': 'Book removed from saved books'}, status=200)
        except:
            return JsonResponse({'error': 'Book does not exist in saved book list'}, status=404)
    else:
        return JsonResponse({'error': 'User not logged in'}, status=400)



@require_POST
@csrf_exempt
def user_verify(request):
    # Check if the session ID is present in the request
    session_id = request.COOKIES.get('sessionid')

    if session_id:

        if request.session.exists(session_id):
            # Get the user associated with the session
            user_id = request.session.get('_auth_user_id')
            # Optionally, you can fetch more information about the user

            # Return a JSON response indicating success and, optionally, user information
            return JsonResponse({'success': True, 'user_id': user_id},)
        else:
            # Return a JSON response indicating that the session is not valid
            return JsonResponse({'success': False, 'error': 'Invalid session ID'}, status=400)
    else:
        # Return a JSON response indicating that the session ID is missing
        return JsonResponse({'success': False, 'error': 'Session ID missing'}, status=400)

