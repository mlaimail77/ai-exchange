# Read the API key from a file
def read_api_key(file_path):
    with open(file_path, 'r') as file:
        return file.read().strip()