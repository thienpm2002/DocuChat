import json
import logging
import time

logger = logging.getLogger(__name__)


def stream_answer(llm, prompt, metadata):
    start = time.perf_counter()

    logger.info("Start LLM streaming")

    try:
        # Metadata
        yield (
            "event: metadata\n"
            f"data: {json.dumps(metadata, ensure_ascii=False)}\n\n"
        )

        chunk_count = 0
        # Tokens
        for chunk in llm.stream(prompt):

            if not chunk.content:
                continue

            chunk_count += 1

            yield (
                "event: token\n"
                f"data: {json.dumps({'text': chunk.content}, ensure_ascii=False)}\n\n"
            )

        elapsed = time.perf_counter() - start

        logger.info(
            "LLM streaming completed: stream_chunks=%s duration=%.2fs",
            chunk_count,
            elapsed
        )

        # Completed
        yield (
            "event: end\n"
            "data: {}\n\n"
        )

    except Exception:
        logger.exception(
            "LLM streaming failed"
        )

        yield (
            "event: error\n"
            f"data: {json.dumps({'message': str(ex)}, ensure_ascii=False)}\n\n"
        )