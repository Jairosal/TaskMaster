import logging
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import update_session_auth_hash
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser
from .serializers import CustomUserSerializer, RegisterSerializer, ChangePasswordSerializer, CustomTokenObtainPairSerializer

logger = logging.getLogger(__name__)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        logger.info(f"Received registration data: {request.data}")
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            logger.info(f"User registered successfully: {serializer.validated_data['username']}")
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )
        logger.error(f"Registration failed. Errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomUserSerializer

    def get_object(self):
        return self.request.user

class ChangePasswordView(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Verificar la contraseña actual
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            
            # Establecer la nueva contraseña
            user.set_password(serializer.validated_data['new_password'])
            user.save()

            # Actualizar la sesión para mantener al usuario autenticado
            update_session_auth_hash(request, user)

            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if email:
            user = CustomUser.objects.filter(email=email).first()
            if user:
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
                
                context = {
                    'user': user,
                    'reset_url': reset_url
                }
                try:
                    logger.info(f"Attempting to render email template for {email}")
                    email_html_message = render_to_string('password_reset_email.html', context)
                    logger.info(f"Email template rendered successfully for {email}")
                    
                    logger.info(f"Attempting to send password reset email to {email}")
                    send_mail(
                        'Password Reset Request',
                        '',  # El cuerpo de texto plano está vacío porque usaremos HTML
                        settings.DEFAULT_FROM_EMAIL,
                        [email],
                        html_message=email_html_message,
                        fail_silently=False,
                    )
                    logger.info(f"Password reset email sent successfully to {email}")
                    return Response({"message": "Password reset email sent"}, status=status.HTTP_200_OK)
                except Exception as e:
                    logger.error(f"Error sending password reset email to {email}: {str(e)}")
                    return Response({"error": "Failed to send email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                logger.warning(f"Password reset requested for non-existent email: {email}")
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        logger.warning("Password reset requested without providing an email")
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
    
class PasswordResetConfirmView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            new_password = request.data.get('new_password')
            if new_password:
                user.set_password(new_password)
                user.save()
                return Response({"message": "Password has been reset"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "New password is required"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Invalid reset link"}, status=status.HTTP_400_BAD_REQUEST)