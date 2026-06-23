
from langchain_chroma import Chroma


def get_vector_store(embedding_model):
    return Chroma(
        persist_directory="./chroma_db",
        embedding_function=embedding_model
    )