from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .llm import get_llm_response
from .vector_db import match_intent
from .dag import execute_dag
import uvicorn
import logging

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

class UserQuery(BaseModel):
    query: str
    vector: list[float]

@app.post("/api/llm")
async def process_user_query(user_query: UserQuery):
    try:
        # Log the message received from frontend
        logger.info(f"Received message from frontend: {user_query.query}")

        # Step 1: Match intent using vector database
        intent = match_intent(user_query.vector)
        logger.info(f"Matched intent: {intent}")

        # Step 2: Get LLM response
        llm_response = get_llm_response(user_query.query)
        logger.info(f"LLM response: {llm_response}")

        # Step 3: Execute DAG (disabled for now)
        # dag_result = execute_dag(llm_response)
        # logger.info(f"DAG execution result: {dag_result}")

        # Ensure that intent and llm_response are JSON serializable
        return {
            "intent": str(intent),
            "llm_response": str(llm_response)
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
