import logging.config
from pathlib import Path

# Tạo thư mục logs nếu chưa có
Path("logs").mkdir(exist_ok=True)

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,

    "formatters": {
        "default": {
            "format": "%(asctime)s %(levelname)-5s [%(threadName)s] %(name)s - %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S"
        }
    },

    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default",
            "level": "INFO"
        },

        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "default",
            "filename": "logs/ai.log",
            "encoding": "utf-8",
            "maxBytes": 5 * 1024 * 1024,
            "backupCount": 3,
            "level": "INFO"
        }
    },

    "loggers": {
        "httpx": {
            "level": "WARNING",
            "propagate": True
        },
        "sentence_transformers": {
            "level": "WARNING",
            "propagate": True
        },
        "huggingface_hub": {
            "level": "WARNING",
            "propagate": True
        },
        "chromadb": {
            "level": "WARNING",
            "propagate": True
        },
        "urllib3": {
            "level": "WARNING",
            "propagate": True
        }
    },

    "root": {
        "handlers": ["console", "file"],
        "level": "INFO"
    },
}


def setup_logging():
    logging.config.dictConfig(LOGGING_CONFIG)