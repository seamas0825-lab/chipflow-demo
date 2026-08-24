import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "ChipFlow 跨境元器件智能采购与决策引擎"
    VERSION: str = "0.9.0-Prototype"
    API_PREFIX: str = "/api"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GCP_PROJECT_ID: str = "project-bef14d05-0d8e-49b9-9d5"
    
    # Currency exchange rates (relative to USD)
    FX_RATES: dict = {
        "USD": 1.0,
        "CNY": 7.24,
        "EUR": 0.92,
        "SEK": 10.45
    }

settings = Settings()
