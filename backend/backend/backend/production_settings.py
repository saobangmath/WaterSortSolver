"""
Production settings for Water Sort Solver
"""
import os
from .settings import *

# watersort is used as a module, not a Django app

# Security settings
DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'
SECRET_KEY = os.environ.get('SECRET_KEY', SECRET_KEY)

# Allowed hosts
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost').split(',')
ALLOWED_HOSTS = ["*"]

# No database configuration needed - using stateless API

# CORS settings for production
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # For development
    "*"
]

# Add your actual frontend URLs here
FRONTEND_URLS = os.environ.get('FRONTEND_URLS', '').split(',')
if FRONTEND_URLS and FRONTEND_URLS[0]:
    CORS_ALLOWED_ORIGINS.extend(FRONTEND_URLS)

# For Vercel deployment, allow all origins in development
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Security headers
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# HTTPS settings (uncomment for production with HTTPS)
# SECURE_SSL_REDIRECT = True
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}

