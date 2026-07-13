import logging
import time

from app.enums.retrieval_status import RetrievalStatus
from app.exceptions.custom_exceptions import DocumentProcessingException

logger = logging.getLogger(__name__)

def retrieve(vector_store, question, document_id, k=8):
    start = time.perf_counter()

    logger.info(
        "Start retrieval: document_id=%s, top_k=%s",
        document_id,
        k
    )

    try:
        results = vector_store.similarity_search_with_score(
            question,
            k=k,
            filter={"document_id": document_id}
        )
    except Exception:
        logger.exception(
            "Vector search failed for document_id=%s",
            document_id
        )

        raise DocumentProcessingException(
            "Failed to retrieve document context."
        )

    docs = [doc for doc, _ in results]

    logger.info("Top-%s retrieval results:", len(results))

    for index, (doc, score) in enumerate(results, start=1):
        logger.info(
            """
    Chunk: %s
    Score: %.4f
    Page : %s
    Content:
    %s
    --------------------------------------------------------------------------------
    """,
            index,
            score,
            doc.metadata.get("page"),
            doc.page_content[:300].replace("\n", " ")
        )

    sources = extract_sources(docs)

    logger.info(
        "Retrieved source pages=%s",
        [s["page"] for s in sources]
    )

    status = (
        RetrievalStatus.FOUND
        if docs
        else RetrievalStatus.NOT_FOUND
    )

    if status == RetrievalStatus.NOT_FOUND:
        logger.warning(
            "No relevant chunks found for document_id=%s",
            document_id
        )

    elapsed = time.perf_counter() - start

    logger.info(
        "Retrieval completed in %.2fs",
        elapsed
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