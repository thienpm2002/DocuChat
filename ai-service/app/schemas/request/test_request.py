from pydantic import BaseModel


class TestRequest(BaseModel):
    message: str
   
    


