class Bot:
    def __init__(self, name, persona):
        self.name = name
        self.persona = persona
        self.context = []  # Combined context for the bot

    def add_message(self, role, content):
        self.context.append({"role": role, "content": content})  # Add to combined context

    def get_response(self, client, temperature, max_tokens):
        """Make an API call to OpenAI to get the LLM response for the bot."""
        messages_list = [{"role": "system", "content": self.persona}] + self.context  # Combine with existing session context
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages_list,
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content 