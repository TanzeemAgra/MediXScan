#!/usr/bin/env python3
"""
Debug script to test environment configuration
"""

import os
import sys
from pathlib import Path

# Set the environment variable explicitly
os.environ['ENVIRONMENT'] = 'development'

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.append(str(backend_dir))

print("=== ENVIRONMENT DEBUG ===")
print(f"Current working directory: {os.getcwd()}")
print(f"Backend directory: {backend_dir}")
print(f"ENVIRONMENT variable: {os.getenv('ENVIRONMENT')}")

try:
    from config_management import EnvironmentConfig
    
    config = EnvironmentConfig()
    print(f"Detected environment: {config.environment}")
    
    db_config = config.database_config
    print(f"Database config: {db_config}")
    
    # Check if .env.development file exists and is being loaded
    env_dev_file = backend_dir / '.env.development'
    print(f".env.development exists: {env_dev_file.exists()}")
    
    if env_dev_file.exists():
        print(f".env.development path: {env_dev_file}")
        
    # Check specific environment variables after loading
    print(f"DB_NAME from env: {os.getenv('DB_NAME')}")
    print(f"DB_HOST from env: {os.getenv('DB_HOST')}")
    
except Exception as e:
    print(f"Error importing config_management: {e}")
    import traceback
    traceback.print_exc()

print("=== END DEBUG ===")