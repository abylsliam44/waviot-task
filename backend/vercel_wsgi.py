import os
import sys
from pathlib import Path

# Add the project directory to the Python path
project_dir = Path(__file__).parent
sys.path.insert(0, str(project_dir))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'todo_project.settings_production')

# Import Django and create the WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

# For Vercel
app = application 