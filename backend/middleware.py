class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        print(f"=== INCOMING REQUEST ===")
        print(f"Method: {request.method}")
        print(f"Path: {request.path}")
        print(f"Headers: {dict(request.headers)}")
        if request.method == 'POST':
            print(f"Body: {request.body}")
        
        response = self.get_response(request)
        
        print(f"=== RESPONSE ===")
        print(f"Status: {response.status_code}")
        
        return response
