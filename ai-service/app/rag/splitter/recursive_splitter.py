from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.exceptions.custom_exceptions import DocumentProcessingException

def split_documents(documents):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.split_documents(documents)

    if not chunks:
        raise DocumentProcessingException(
            "No text chunks could be generated from this PDF."
        )

    return chunks