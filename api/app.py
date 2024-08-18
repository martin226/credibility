from dotenv import load_dotenv
import os
from flask import Flask

load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

app = Flask(__name__)
import routes