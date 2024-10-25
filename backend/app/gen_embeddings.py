from openai import OpenAI
import numpy as np
import os
from utils import read_api_key
import json  # Added import for JSON handling

# Set your OpenAI API key
api_key_file = os.path.join(os.path.dirname(__file__), 'oai-api-key.lic')
api_key = read_api_key(api_key_file)
client = OpenAI(api_key=api_key)

# Define your intents and get embeddings for them
intents = [
    {"intent": "Buy NFT", "phrase": "Buy NFT"},
    {"intent": "Check Wallet balance", "phrase": "Check Wallet balance"}
]

# Generate embeddings for each intent and add them to the intent dictionary
for intent in intents:
    response = client.embeddings.create(input=intent["phrase"], model="text-embedding-3-small")  # Updated method
    intent["vector"] = np.array(response.data[0].embedding)  # Changed to access attributes instead of subscripting
    intent["vector"] = intent["vector"].tolist()  # Convert ndarray to list for JSON serialization

# Save the vectors to rag_embeddings.json
with open('rag_embeddings.json', 'w') as json_file:  # New code to save to JSON
    json.dump(intents, json_file)  # Dump the intents list to the JSON file
