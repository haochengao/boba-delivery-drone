# services/users/src/__init__.py


import os

from flask import Flask
from flask_admin import Admin
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
import threading
import time
from flask_socketio import SocketIO, emit, send

# instantiate the extensions
cors = CORS()
admin = Admin(template_mode="bootstrap3")
socketio = SocketIO()



def create_app(script_info=None):

    # instantiate the app
    app = Flask(__name__)
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_port=1)

    #
    socketio.init_app(app, cors_allowed_origins="*")

    # set config
    app_settings = os.getenv("APP_SETTINGS")
    app.config.from_object(app_settings)


    # set up extensions
    cors.init_app(app, resources={r"*": {"origins": "*"}})

    if os.getenv("FLASK_ENV") == "development":
        admin.init_app(app)

    # register api


    # shell context for flask cli
    @app.shell_context_processor
    def ctx():
        return {"app": app}

    return app


@socketio.on('connect')
def connect():
    emit('connect', {'lat': 10, 'lng': 10})
    print('test')

@socketio.on("message")
def handleMessage(msg):
    print(msg)
    send(msg, broadcast=True)
    return None

