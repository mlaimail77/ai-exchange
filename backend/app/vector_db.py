
import numpy as np

# Dummy vectors for top-5 intents
intents = [
    {"intent": "Buy NFT", "vector": np.array([0.1, 0.2, 0.3])},
    {"intent": "Check Balance", "vector": np.array([0.4, 0.1, 0.3])},
    # Add more intents here...
]

def cosine_similarity(vecA, vecB):
    dot_product = np.dot(vecA, vecB)
    normA = np.linalg.norm(vecA)
    normB = np.linalg.norm(vecB)
    return dot_product / (normA * normB)

def match_intent(query_vector):
    best_match = None
    best_score = -1
    
    for intent in intents:
        score = cosine_similarity(query_vector, intent["vector"])
        if score > best_score:
            best_score = score
            best_match = intent
    
    return best_match
