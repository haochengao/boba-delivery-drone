# services/users/src/config.py


import os


class BaseConfig:
    TESTING = False
    SECRET_KEY = "my_precious"


class DevelopmentConfig(BaseConfig):
    TESTING = False


class TestingConfig(BaseConfig):
    TESTING = True


class ProductionConfig(BaseConfig):
    SECRET_KEY = os.getenv("SECRET_KEY", "my_precious")
