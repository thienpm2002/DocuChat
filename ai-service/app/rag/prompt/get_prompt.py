from langchain_core.prompts import PromptTemplate

PROMPT = PromptTemplate.from_template("""
You are a helpful assistant that answers questions using ONLY the provided context.

Rules:
- Treat the provided context as the only source of truth.
- Never use outside knowledge or invent information.
- If the provided context does not contain enough information to answer the question, reply exactly:
"Tôi không tìm thấy đủ thông tin trong ngữ cảnh được cung cấp để trả lời câu hỏi này."
- Keep the answer concise and accurate.
- Answer in the same language as the user's question.

Context:
{context}

Question:
{question}

Answer:
""")

def build_prompt(question, context):
    return PROMPT.invoke({
        "question": question,
        "context": context
    })