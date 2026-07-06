from app.enums.retrieval_status import RetrievalStatus

def retrieve(vector_store, question, document_id, k=5):
    docs = vector_store.similarity_search(
        question,
        k=k,
        filter={"document_id": document_id}
    )

    sources = extract_sources(docs)

    status = (
        RetrievalStatus.FOUND
        if docs
        else RetrievalStatus.NOT_FOUND
    )

    return docs, sources, status


def extract_sources(docs):
    seen = set()
    sources = []

    for doc in docs:
        page = doc.metadata["page"]

        if page not in seen:
            seen.add(page)
            sources.append({
                "page": page
            })

    sources.sort(key=lambda s: s["page"])

    return sources