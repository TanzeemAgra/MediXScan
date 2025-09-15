from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'
    path = r'D:\radiology_v2\backend\accounts'  # Explicit path to resolve conflict