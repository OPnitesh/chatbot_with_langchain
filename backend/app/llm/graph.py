from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import AIMessage
from app.llm.state import ChatState
from dotenv import load_dotenv
load_dotenv()

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")


def chatbot_node(state: ChatState) -> ChatState:
    response = llm.invoke(state["messages"])
    return {
        "messages": state["messages"] + [response]
    }


def build_graph():
    graph = StateGraph(ChatState)
    graph.add_node("chatbot", chatbot_node)
    graph.set_entry_point("chatbot")
    graph.add_edge("chatbot", END)
    return graph.compile()


# ✅ BUILD ONCE
graph = build_graph()
