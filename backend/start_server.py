#!/usr/bin/env python
import os
import sys
import django
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')
    django.setup()
    
    # Start the server
    execute_from_command_line(['manage.py', 'runserver', '127.0.0.1:8000'])
