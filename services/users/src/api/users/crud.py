from src import db
from src.api.users.models import User
from src.api.users.models import Delivery
from datetime import timedelta
from math import cos, asin, sqrt, pi


def get_all_users():
    return User.query.all()


def get_user_by_id(user_id):
    return User.query.filter_by(id=user_id).first()


def get_user_by_email(email):
    return User.query.filter_by(email=email).first()


def add_user(username, email, password):
    user = User(username=username, email=email, password=password)
    db.session.add(user)
    db.session.commit()
    return user


def update_user(user, username, email):
    user.username = username
    user.email = email
    db.session.commit()
    return user


def delete_user(user):
    db.session.delete(user)
    db.session.commit()
    return user

def travel_time_minutes(lat1, lon1, lat2=38.0672540399235, lon2=-78.71148116035546):
    p = pi/180
    a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p) * cos(lat2*p) * (1-cos((lon2-lon1)*p))/2
    return 12742 * asin(sqrt(a)) / 0.268224

def get_all_deliveries():
    return Delivery.query.all()


def get_delivery_by_id(delivery_id):
    return Delivery.query.filter_by(delivery=id).first()



def add_delivery(user_id, end_date_time, lat, lng):
    start_date_time = end_date_time - timedelta(minutes=travel_time_minutes(lat, lng))
    delivery = Delivery(user_id=user_id, start_date_time=start_date_time, end_date_time=end_date_time, lat=lat, lng=lng)
    db.session.add(delivery)
    db.session.commit()
    return delivery


def update_delivery_status(delivery, status):
    #0 is yet to be delivered
    #1 is delivery in progress
    #2 is delivered
    delivery.status = status
    db.session.commit()
    return delivery


def delete_delivery(delivery):
    db.session.delete(delivery)
    db.session.commit()
    return delivery
