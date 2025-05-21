import requests
from django.conf import settings
import base64

def get_monnify_token():
    auth_string = f"{settings.MONNIFY_API_KEY}:{settings.MONNIFY_SECRET_KEY}"
    encoded_auth = base64.b64encode(auth_string.encode()).decode()
    
    headers = {
        "Authorization": f"Basic {encoded_auth}"
    }
    
    response = requests.post(
        f"{settings.MONNIFY_BASE_URL}/api/v1/auth/login",
        headers=headers
    )
    
    if response.status_code == 200:
        return response.json()['responseBody']['accessToken']
    return None