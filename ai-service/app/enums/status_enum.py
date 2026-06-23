from enum import Enum

class StatusEnum(str, Enum):
    READY = "READY"
    FAILED = "FAILED"