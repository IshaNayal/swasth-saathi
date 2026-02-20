import os

class Config:
    MODEL_PATH = os.getenv('MODEL_PATH', './app/models/')
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    MLFLOW_URI = os.getenv('MLFLOW_URI', '')
