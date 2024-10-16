import os
from openai import OpenAI

# Read the API key from a file
def read_api_key(file_path):
    with open(file_path, 'r') as file:
        return file.read().strip()

# Get the API key
api_key_file = os.path.join(os.path.dirname(__file__), 'oai-api-key.txt')
api_key = read_api_key(api_key_file)

# Initialize the OpenAI client
client = OpenAI(api_key=api_key)

def get_llm_response(user_query):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a crypto exchange customer service agent. Limit the response to one sentence"},
            {"role": "user", "content": user_query}
        ]
    )
    # Return only the text content of the response
    return response.choices[0].message.content
