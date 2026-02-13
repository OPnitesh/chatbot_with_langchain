# graph.py

from langgraph.graph import StateGraph, END
from langchain_core.messages import AIMessage
from app.llm.state import ChatState
from app.llm.agent import get_chain


chain = get_chain()


def chatbot_node(state: ChatState) -> ChatState:
    user_input = state["messages"][-1].content

    response = chain.invoke({"input": user_input})

    return {
        "messages": state["messages"] + [
            AIMessage(content=response.content)
        ]
    }


def build_graph():
    graph = StateGraph(ChatState)
    graph.add_node("chatbot", chatbot_node)
    graph.set_entry_point("chatbot")
    graph.add_edge("chatbot", END)
    return graph.compile()


graph = build_graph()
