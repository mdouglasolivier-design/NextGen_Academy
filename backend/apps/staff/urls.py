from django.urls import path
from .views import DashboardView, MyActivityView

urlpatterns = [
    path("staff/dashboard/", DashboardView.as_view()),
    path("staff/activity/", MyActivityView.as_view()),
]
