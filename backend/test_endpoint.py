from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def test_endpoint(request):
    return JsonResponse({'status': 'Backend is working', 'method': request.method})
