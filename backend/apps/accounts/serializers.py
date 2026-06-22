from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db.models import Q
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="get_full_name", read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "username", "first_name", "last_name", "full_name", "profile_picture"]
        read_only_fields = ["id", "full_name"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "email", "username", "first_name", "last_name", "profile_picture", "password"]
        read_only_fields = ["id"]

    def validate_email(self, value):
        return value.lower()

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def to_representation(self, instance):
        refresh = RefreshToken.for_user(instance)

        return {
            "user": UserSerializer(instance, context=self.context).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }


class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    login = serializers.CharField(write_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields.pop("email", None)

    def validate(self, attrs):
        login = attrs.pop("login", "").strip()

        try:
            user = User.objects.get(Q(email__iexact=login) | Q(username__iexact=login))
        except User.DoesNotExist:
            user = None

        attrs["email"] = user.email if user else login
        return super().validate(attrs)
