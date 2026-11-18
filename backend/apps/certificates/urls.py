from django.urls import path
from .views import VerifyCertificateView

urlpatterns = [
    path("verify/<str:code>/", VerifyCertificateView.as_view()),
]
