# chat_service.py

from langchain_core.messages import HumanMessage
from app.llm.graph import graph
from app.llm.guard import is_aws_related, BLOCK_MESSAGE



SESSION_STORE = {}


def generate_response(user_message: str, session_id: str) -> str:

    if not is_aws_related(user_message):
        return BLOCK_MESSAGE


    if session_id not in SESSION_STORE:
        SESSION_STORE[session_id] = {"messages": []}

    SESSION_STORE[session_id]["messages"].append(
        HumanMessage(content=user_message)
    )

    result = graph.invoke(SESSION_STORE[session_id])

    SESSION_STORE[session_id] = result

    return result["messages"][-1].content
