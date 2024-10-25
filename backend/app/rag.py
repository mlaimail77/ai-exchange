import numpy as np
import json

class RAG:
    def __init__(self, embeddings_path):  # Update this line
        # DAG dummy templates corresponsing to the pre-processed vector intent vector embeddings
        self.dag_templates = {
            "Buy NFT": [
                {"service": "wallet", "action": "check-balance", "api": "GET /wallets/{userId}/balance"},
                {"service": "nft-market", "action": "check-availability", "api": "GET /nft-market/{nftId}/status"},
                {"service": "gas-fees", "action": "estimate", "api": "POST /gas-fees/estimate"},
                {"service": "nft-market", "action": "prepare-transaction", "api": "POST /nft-market/{nftId}/prepare-purchase"},
                {"service": "wallet", "action": "sign-transaction", "api": "POST /wallets/{userId}/sign"},
                {"service": "blockchain", "action": "submit-transaction", "api": "POST /blockchain/submit"},
                {"service": "blockchain", "action": "confirm-transaction", "api": "GET /blockchain/transaction/{txId}/status"},
                {"service": "notification", "action": "send-receipt", "api": "POST /notifications/send"}
            ],
            "Check Wallet balance": [
                {"service": "wallet", "action": "check-balance", "api": "GET /wallets/{userId}/balance"}
            ]
        }

        # Load intents from JSON file
        self.intents = self.load_intents(embeddings_path)

    def load_intents(self, file_path):
        """Load intents from a JSON file."""
        with open(file_path, 'r') as file:
            data = json.load(file)
            return [{"intent": item["intent"], "vector": np.array(item["vector"])} for item in data]

    def get_input_embeddings(self, client, text, model="text-embedding-3-small"):
        """Generate a 1536-dimensional embedding for the given text."""
        response = client.embeddings.create(input=text, model=model)
        # Update this line to access the embedding correctly
        return np.array(response.data[0].embedding)  # Accessing attributes instead of using indexing

    def cosine_similarity(self, vecA, vecB):
        """Calculate cosine similarity between two vectors."""
        dot_product = np.dot(vecA, vecB)
        normA = np.linalg.norm(vecA)
        normB = np.linalg.norm(vecB)
        return dot_product / (normA * normB)

    def match_intent(self, query_vector):
        """Match the best intent using cosine similarity."""
        best_match = None
        best_score = -1
        threshold = 0.4  # Define a threshold for matching; dummy for now

        for intent in self.intents:
            score = self.cosine_similarity(query_vector, intent["vector"])
            if score > best_score:
                best_score = score
                best_match = intent

        # Check if the best score exceeds the threshold
        if best_score >= threshold:
            return best_match
        else:
            return None  # Return None if no match exceeds the threshold

    def execute_dag(self, intent):
        """Execute the corresponding DAG for the matched intent."""
        dag_flow = self.dag_templates.get(intent)
        if not dag_flow:
            return "No DAG defined for this intent."

        executed_steps = []  # Initialize a list to store executed steps

        for step in dag_flow:
            print(f"> Executing:{step['action']} on {step['service']} (API: {step['api']})")
            executed_steps.append(step)  # Add the executed step to the list
            # Perform the actual API call or logic here.
            # Example: call_api(step['service'], step['action'], step['api'])

        return executed_steps  # Return the list of executed steps

    def process_query(self, query_vector):
        """Process the query vector to match intent and execute the DAG."""
        matched_intent = self.match_intent(query_vector)
        if matched_intent:
            print(f"Matched Intent: {matched_intent['intent']}")
            executed_steps = self.execute_dag(matched_intent["intent"])
            return executed_steps, True  # Return executed steps and True if a match is found
        else:
            return None, False  # Return None and False if no matching intent is found
