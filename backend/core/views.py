import secrets
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.conf import settings

from .models import EmailOTP
from .serializers import RequestOTPSerializer, VerifyOTPSerializer

class RequestOTPView(APIView):
    def post(self, request):
        serializer = RequestOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        otp = str(secrets.randbelow(900000) + 100000)  # 6-digit secure OTP

        # Mark previous OTPs as used
        EmailOTP.objects.filter(email=email, is_used=False).update(is_used=True)

        # Create new OTP record
        EmailOTP.objects.create(email=email, otp=otp)

        # Send OTP email
        try:
            send_mail(
                subject="Your Login OTP",
                message=f"Your OTP is {otp}. It expires in 5 minutes.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            return Response({"error": "Failed to send OTP email"}, status=500)

        return Response({"message": "OTP sent"}, status=status.HTTP_200_OK)

class VerifyOTPView(APIView):
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']

        # Get latest active OTP
        record = EmailOTP.objects.filter(email=email, otp=otp, is_used=False).order_by('-created_at').first()
        if not record:
            return Response({"error": "Invalid OTP"}, status=400)

        if not record.is_valid():
            return Response({"error": "OTP expired"}, status=400)

        record.is_used = True
        record.save()

        user, created = User.objects.get_or_create(
            username=email,
            defaults={"email": email}
        )

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })
