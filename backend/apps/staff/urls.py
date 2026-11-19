from django.urls import path
from .views import DashboardView, MyActivityView, StaffCourseListView

urlpatterns = [
    path("staff/dashboard/", DashboardView.as_view()),
    path("staff/activity/", MyActivityView.as_view()),
    path("staff/courses/", StaffCourseListView.as_view()),
]
