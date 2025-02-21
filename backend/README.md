
# Crypto Exchange Backend

This is a backend for a crypto exchange service that interacts with an LLM (GPT-4) to process user intents. The system also matches intents against a predefined list using a vector database and executes a corresponding DAG.

## Getting Started

### Prerequisites
- Python 3.8 or higher
- FastAPI
- Uvicorn
- OpenAI API key

### Installation

1. Clone the repository.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Add your OpenAI API key to the environment:

```bash
export OPENAI_API_KEY="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"
```

4. Run the FastAPI server:

```bash
uvicorn main:app --reload
```

### Usage

Send a POST request to `/api/llm` with the following structure:

```json
{
  "query": "I want to buy Pudgy Penguins NFT",
  "vector": [0.1, 0.2, 0.3]  # Example vector
}
```

The server will return the matched intent and execute the corresponding DAG.

### License
This project is licensed under the MIT License.
