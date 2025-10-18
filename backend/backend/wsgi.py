"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application

# Use production settings if in production
if os.environ.get('DJANGO_SETTINGS_MODULE') == 'backend.production_settings':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.production_settings')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_wsgi_application()




