from django.urls import path
from . import views



urlpatterns = [

    path("membership/", views.membership, name="membership"),
    path("emailpatch/", views.account_email_patch, name="email_patch"),
    path("memberlogin/", views.member_login, name="memberlogin"),
    path("memberlogout/", views.member_logout, name="memberlogout"),
    path("memberprofile/", views.create_member_profile, name="creatememberprofile"),
    path("viewprofile/", views.member_profile, name="viewmemberprofile"),
    path("viewaccount/", views.member_account, name="viewmemberaccount"),
    path("logstatus/", views.log_status, name="logstatus"),
    path("savebook/<int:id>", views.save_book, name="savebook"),
    path("savedbooks/", views.saved_books_list, name="savedbooksList"),
    path("boughtbooks/", views.purchase, name="purchasebooksList"),
    path("boughthistory/", views.purchase_history, name="purchasebookhistory"),
    path("bookstatus/<int:id>", views.book_status, name="bookstatus"),
    path("deletebook/<int:id>", views.delete_book, name='delete_book'),
    path("verify/", views.user_verify, name='verify'),

]
