import requests, time, json

API_BASE = 'http://localhost:8000'

suffix = int(time.time())
user = f'quickuser_{suffix}'
email = f'quick_{suffix}@example.com'
payload = {
    'username': user,
    'email': email,
    'password': 'TestPass123!',
    'password_confirm': 'TestPass123!',
    'first_name': 'Quick',
    'last_name': 'Test'
}

print('Posting:', payload)
r = requests.post(f'{API_BASE}/api/auth/register/', json=payload)
print('Status:', r.status_code)
try:
    print('Response:', json.dumps(r.json(), indent=2))
except Exception:
    print('Raw:', r.text)
