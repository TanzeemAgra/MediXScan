"""
Ultra-simple Python WSGI app without Django
"""

def application(environ, start_response):
    """Simple WSGI application that just returns OK"""
    
    path = environ.get('PATH_INFO', '/')
    
    if path == '/test-wsgi/':
        status = '200 OK'
        response_body = b'PURE PYTHON WSGI IS WORKING!'
    elif path == '/health':
        status = '200 OK'
        response_body = b'OK'  # Railway health check
    elif path == '/':
        status = '200 OK'
        response_body = b'WSGI App Running - Root endpoint working!'
    elif path == '/test-info/':
        status = '200 OK'
        import sys
        import os
        response_body = f"""
Python Version: {sys.version}
Environment Variables:
- PORT: {os.getenv('PORT', 'NOT SET')}
- DATABASE_URL: {'SET' if os.getenv('DATABASE_URL') else 'NOT SET'}
- RAILWAY_ENVIRONMENT: {os.getenv('RAILWAY_ENVIRONMENT', 'NOT SET')}
Path: {path}
Request Method: {environ.get('REQUEST_METHOD')}
Host: {environ.get('HTTP_HOST', 'NOT SET')}
""".encode()
    else:
        status = '200 OK'
        response_body = f'Simple WSGI App - Path: {path} - try /test-wsgi/ or /test-info/'.encode()
    
    headers = [('Content-Type', 'text/plain')]
    start_response(status, headers)
    return [response_body]