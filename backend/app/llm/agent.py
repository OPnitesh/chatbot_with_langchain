from langchain.agents import create_agent
from functools import lru_cache
from dotenv import load_dotenv

load_dotenv()


@lru_cache
def get_agent():
    """
    LangChain agent with conversation memory
    """


    agent = create_agent(
        model="google_genai:gemini-2.5-flash",
        tools=[],
        
    )

    return agent
