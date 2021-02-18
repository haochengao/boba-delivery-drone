# manage.py


import sys

from flask.cli import FlaskGroup

from src import create_app, socketio
import threading
import time

app = create_app()
cli = FlaskGroup(create_app=create_app)

def location():
    while(True):
        time.sleep(1)
        socketio.emit('location', {'lat': 10, 'lng': 10})


if __name__ == '__main__':
    #cli()
    #print('socket starting')
    locationthread = threading.Thread(target=location)
    locationthread.start()
    socketio.run(app, host='0.0.0.0', port=5008)
