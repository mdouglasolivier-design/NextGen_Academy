from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from .models import Course
from .serializers import CourseDetailSerializer, CourseListSerializer

PUBLISHED = Course.objects.filter(status="published", deleted_at__isnull=True)


class CourseListView(ListAPIView):
    queryset = PUBLISHED
    serializer_class = CourseListSerializer
    permission_classes = [AllowAny]


class CourseDetailView(RetrieveAPIView):
    queryset = PUBLISHED.prefetch_related("modules__lessons")
    serializer_class = CourseDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"
