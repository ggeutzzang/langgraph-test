import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, List
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
import logging

load_dotenv()

app = FastAPI()

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ChatOpenAI 모델 초기화
chat_model = ChatOpenAI(model="gpt-4o")


# 상태 스키마 정의
class State(TypedDict):
    messages: Annotated[List[HumanMessage | AIMessage], "add_messages"]
    history: List[str]


# LangGraph 정의
def chat_step(state: State) -> State:
    # 이전 대화 히스토리 가져오기 (최대 4개)
    history = state.get("history", [])[-4:]

    # 시스템 메시지 생성
    system_message = SystemMessage(content=f"이전 대화 내용: {' '.join(history)}")

    # 현재 사용자 메시지
    current_message = state["messages"][-1]

    # 프롬프트 생성
    messages = [system_message, current_message]

    # 모델 호출
    response = chat_model.invoke(messages)

    # 히스토리 업데이트
    new_history = history + [
        f"User: {current_message.content}",
        f"AI: {response.content}",
    ]

    return {"messages": [response], "history": new_history}


workflow = StateGraph(State)
workflow.add_node("chat", chat_step)
workflow.set_entry_point("chat")
workflow.add_edge("chat", END)

chain = workflow.compile()


class ChatInput(BaseModel):
    message: str


@app.post("/api/chat")
async def chat_endpoint(chat_input: ChatInput):
    try:
        logger.info(f"받은 메시지: {chat_input.message}")
        state = {"messages": [HumanMessage(content=chat_input.message)], "history": []}
        logger.info("chain.invoke 호출 전")
        result = chain.invoke(state)
        logger.info(f"chain.invoke 결과: {result}")
        response = result["messages"][0].content
        logger.info(f"응답: {response}")
        return {"response": response}
    except Exception as e:
        logger.error(f"오류 발생: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def read_root():
    return {"Hello": "World"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
