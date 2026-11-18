from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Certificate


class VerifyCertificateView(APIView):
    """Public. Returns only non-private data (never the email)."""
    permission_classes = [AllowAny]

    def get(self, request, code):
        try:
            cert = Certificate.objects.select_related("user", "course").get(certificate_code=code)
        except Certificate.DoesNotExist:
            return Response({"valid": False, "detail": "Certificate not found"}, status=404)
        return Response({
            "valid": cert.status == Certificate.Status.VALID,
            "status": cert.status,
            "certificate_code": cert.certificate_code,
            "holder_name": cert.user.full_name,
            "course": cert.course.title,
            "issued_at": cert.issued_at.date().isoformat(),
        })
