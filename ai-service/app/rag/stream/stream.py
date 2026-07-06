import json
import logging

logger = logging.getLogger(__name__)


def stream_answer(llm, prompt, metadata):
    try:
        # Metadata
        yield (
            "event: metadata\n"
            f"data: {json.dumps(metadata, ensure_ascii=False)}\n\n"
        )

        # Tokens
        for chunk in llm.stream(prompt):

            if not chunk.content:
                continue

            yield (
                "event: token\n"
                f"data: {json.dumps({'text': chunk.content}, ensure_ascii=False)}\n\n"
            )

        # Completed
        yield (
            "event: end\n"
            "data: {}\n\n"
        )

    except Exception as ex:
        logger.exception("Stream failed")

        yield (
            "event: error\n"
            f"data: {json.dumps({'message': str(ex)}, ensure_ascii=False)}\n\n"
        )