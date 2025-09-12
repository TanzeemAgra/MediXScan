import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_api_key():
    """Test if OpenAI API key is properly configured"""
    api_key = os.getenv('OPENAI_API_KEY')
    
    if not api_key:
        print("❌ OpenAI API Key: NOT FOUND")
        return False
    
    if not api_key.startswith('sk-'):
        print("❌ OpenAI API Key: INVALID FORMAT")
        return False
    
    print("✅ OpenAI API Key: CONFIGURED")
    print(f"   Key prefix: {api_key[:20]}...")
    print(f"   Key length: {len(api_key)} characters")
    
    # Try to import openai
    try:
        import openai
        print("✅ OpenAI library: INSTALLED")
        
        # Test API call
        client = openai.OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Hello, respond with 'API Working'"}],
            max_tokens=5
        )
        print("✅ OpenAI API: WORKING")
        print(f"   Response: {response.choices[0].message.content}")
        return True
        
    except ImportError:
        print("❌ OpenAI library: NOT INSTALLED")
        print("   Run: pip install openai")
        return False
    except Exception as e:
        print(f"❌ OpenAI API: ERROR - {str(e)}")
        return False

if __name__ == "__main__":
    test_api_key()
