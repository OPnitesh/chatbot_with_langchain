from app.llm.agent import get_agent

def generate_response(messages: list[dict]) -> str:
    agent = get_agent()

    result = agent.invoke({
        "messages": messages
    })

    # Extract assistant reply
    last_message = result["messages"][-1]
    return last_message.content
