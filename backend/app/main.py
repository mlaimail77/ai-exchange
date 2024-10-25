from openai import OpenAI
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .bot import Bot
from .rag import RAG
from .utils import read_api_key
import uvicorn
import logging
import os

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Get the OpenAI API key
api_key_file = os.path.join(os.path.dirname(__file__), 'oai-api-key.lic')
api_key = read_api_key(api_key_file)
    
# Initialize the OpenAI client
client = OpenAI(api_key=api_key)

# Instantiate the Bot
bot = Bot(name="Agent", persona="You are a crypto exchange customer service agent.\
                        You will try to understand the user's intent and synthesize\
                        what the user is trying to accomplish in one short sentence. \
                        What you synthesized will be used to query a vector database\
                        to retreive the most relevant actions. You will have context of\
                        the user's previous querys, but if each response is uncorrelated\
                        treat the latest query as a new question when trying to understand\
                        the user's intent. Don't be afraid to reject non-crypto related asks.\
                        Start the response by saying: Well received! I believe you are \
                        trying to...; with the latter being the synthesized intent of the user")

# Instantiate the RAG
embedding_file_path = os.path.join(os.path.dirname(__file__), 'rag_embeddings.json')
rag = RAG(embedding_file_path)

# Instantiate the User querey from frontend
class UserQuery(BaseModel):
    query: str

@app.post("/api/llm")
async def process_user_query(user_query: UserQuery):
    try:
        # Log the message received from frontend
        logger.info(f"Received message from frontend: {user_query.query}")

        # Step 1: Get LLM response using the bot instance
        bot.add_message("user", user_query.query)
        bot_response = bot.get_response(client, temperature=1.0, max_tokens=100) 
     
        # Step 2: Convert the user bot_response to embeddings
        intent_embeddings = rag.get_input_embeddings(client, bot_response)
        logger.info(f"Intent embeddings generated: {intent_embeddings}")  # Log the intent embeddings

        # Step 3: Match embeddings with the VectorDB within the RAG   
        rag_response = rag.process_query(intent_embeddings)
        logger.info(f"RAG match result: {rag_response}")

        # Ensure that intent, llm_response, and rag_result are JSON serializable
        llm_response = str(bot_response)
        if rag_response[1]:  # Check if there is a match to intent
            llm_response += " I shall help you process your intent..."  # Add message if intent is matched
        else:
            llm_response = "Sorry, there seems to be a problem understanding your intent, please try again!"
        
        return {
            "llm_response": llm_response, 
            "rag_result": rag_response[0]
        }
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

if __name__ == "__main__":
    logger.info("Starting the server...")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        log_level="info",
        reload=True
    )
