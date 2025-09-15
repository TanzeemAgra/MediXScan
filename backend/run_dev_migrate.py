#!/usr/bin/env python3
"""
Run Django with development environment settings
"""

import os
import sys
from pathlib import Path

# Set environment before importing anything Django related
os.environ['ENVIRONMENT'] = 'development'
os.environ['DJANGO_SETTINGS_MODULE'] = 'medixscan_project.settings'

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.append(str(backend_dir))

if __name__ == '__main__':
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    # Set sys.argv to mimic manage.py migrate command
    sys.argv = ['manage.py', 'migrate']
    execute_from_command_line(sys.argv)