from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


def get_user_data(user):
    return {
        "id": user.id,
        "username": user.get_username(),
        "is_staff": user.is_staff,
    }


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfTokenView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        return Response(
            {
                "detail": "CSRF cookie set",
                "csrfToken": get_token(request),
            }
        )


class CurrentUserView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            return Response(
                {
                    "is_authenticated": True,
                    "user": get_user_data(request.user),
                }
            )

        return Response(
            {
                "is_authenticated": False,
                "user": None,
            }
        )


@method_decorator(csrf_protect, name="dispatch")
class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        username = request.data.get("username", "").strip()
        password = request.data.get("password", "")

        if not username or not password:
            return Response(
                {"detail": "Username and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response(
                {"detail": "Invalid username or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_staff:
            return Response(
                {"detail": "Admin access is required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        login(request, user)

        return Response(
            {
                "detail": "Login successful.",
                "user": get_user_data(user),
            }
        )


class AdminLogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logout(request)
        return Response({"detail": "Logout successful."})
