import logging
import time
import uuid

from fastapi import Request

logger = logging.getLogger(__name__)


async def request_logging_middleware(
    request: Request,
    call_next
):
    request_id = request.headers.get(
        "X-Request-Id",
        str(uuid.uuid4())
    )

    request.state.request_id = request_id

    start_time = time.perf_counter()

    response = None

    try:
        response = await call_next(request)
        return response

    finally:
        duration_ms = (
            time.perf_counter() - start_time
        ) * 1000

        status = (
            response.status_code
            if response
            else 500
        )

        logger.info(
            "requestId=%s method=%s path=%s status=%s duration=%.2fms",
            request_id,
            request.method,
            request.url.path,
            status,
            duration_ms
        )

        if response:
            response.headers["X-Request-Id"] = request_id