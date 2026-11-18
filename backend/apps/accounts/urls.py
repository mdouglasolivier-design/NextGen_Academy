from django.urls import path
from .views import MeView

urlpatterns = [
    path("me/", MeView.as_view()),
    # TODO: register, verify-email, password reset
]
