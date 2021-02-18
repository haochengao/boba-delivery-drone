# src/api/users.py


from flask import request
from flask_restx import Namespace, Resource, fields
from datetime import datetime

from src.api.users.models import User
from src.api.users.crud import (  # isort:skip
    get_all_users,
    get_user_by_email,
    add_user,
    get_user_by_id,
    update_user,
    delete_user,
    get_all_deliveries,
    get_delivery_by_id,
    add_delivery,
    update_delivery_status,
    delete_delivery,
)
users_namespace = Namespace("users")


user = users_namespace.model(
    "User",
    {
        "id": fields.Integer(readOnly=True),
        "username": fields.String(required=True),
        "email": fields.String(required=True),
        "created_date": fields.DateTime,
    },
)

user_post = users_namespace.inherit(
    "User post", user, {"password": fields.String(required=True)}
)


class UsersList(Resource):
    @users_namespace.marshal_with(user, as_list=True)
    def get(self):
        """Returns all users."""
        return get_all_users(), 200

    @users_namespace.expect(user_post, validate=True)  # updated
    @users_namespace.response(201, "<user_email> was added!")
    @users_namespace.response(400, "Sorry. That email already exists.")
    def post(self):
        """Creates a new user."""
        post_data = request.get_json()
        username = post_data.get("username")
        email = post_data.get("email")
        password = post_data.get("password")
        response_object = {}

        user = get_user_by_email(email)
        if user:
            response_object["message"] = "Sorry. That email already exists."
            return response_object, 400

        add_user(username, email, password)
        response_object["message"] = f"{email} was added!"
        return response_object, 201


class Users(Resource):
    @users_namespace.marshal_with(user)
    @users_namespace.response(200, "Success")
    @users_namespace.response(404, "User <user_id> does not exist")
    def get(self, user_id):
        """Returns a single user."""
        user = get_user_by_id(user_id)
        if not user:
            users_namespace.abort(404, f"User {user_id} does not exist")
        return user, 200

    @users_namespace.expect(user, validate=True)
    @users_namespace.response(200, "<user_id> was updated!")
    @users_namespace.response(400, "Sorry. That email already exists.")
    @users_namespace.response(404, "User <user_id> does not exist")
    def put(self, user_id):
        """Updates a user."""
        post_data = request.get_json()
        username = post_data.get("username")
        email = post_data.get("email")
        response_object = {}

        user = get_user_by_id(user_id)
        if not user:
            users_namespace.abort(404, f"User {user_id} does not exist")

        if get_user_by_email(email):
            response_object["message"] = "Sorry. That email already exists."
            return response_object, 400

        update_user(user, username, email)

        response_object["message"] = f"{user.id} was updated!"
        return response_object, 200

    @users_namespace.response(200, "<user_id> was removed!")
    @users_namespace.response(404, "User <user_id> does not exist")
    def delete(self, user_id):
        """"Deletes a user."""
        response_object = {}
        user = get_user_by_id(user_id)

        if not user:
            users_namespace.abort(404, f"User {user_id} does not exist")

        delete_user(user)

        response_object["message"] = f"{user.email} was removed!"
        return response_object, 200


users_namespace.add_resource(UsersList, "")
users_namespace.add_resource(Users, "/<int:user_id>")


deliveries_namespace = Namespace("deliveries")


delivery = deliveries_namespace.model(
    "Delivery",
    {
        "id": fields.Integer(readOnly=True),
        "user_id": fields.Integer(),
        "placed_date_time": fields.DateTime,
        "start_date_time": fields.DateTime,
        "end_date_time": fields.DateTime,
        "status": fields.Integer(),
        "lat": fields.Float(required=True),
        "lng": fields.Float(required=True),
    },
)

delivery_post = deliveries_namespace.inherit(
    "Delivery post", delivery, {"token": fields.String(required=True)}
)



class DeliveriesList(Resource):
    @deliveries_namespace.marshal_with(delivery, as_list=True)
    def get(self):
        """Returns all deliveries."""
        return get_all_deliveries(), 200

    @deliveries_namespace.response(201, 'this is a 201')
    def post(self):
        """Creates a new delivery."""
        post_data = request.get_json()
        token = post_data.get("token")
        user_id = User.decode_token(token)
        user = get_user_by_id(user_id)
        if not user:
            deliveries_namespace.abort(404, f"User {user_id} does not exist")
        end_date_time = post_data.get("end_date_time")
        end_date_time = datetime.strptime(post_data.get("end_date_time"), '%Y-%m-%dT%H:%M:%S.%fZ')
        lat = post_data.get("lat")
        lng = post_data.get("lng")
        response_object = {}

        delivery = add_delivery(user_id=user_id, end_date_time=end_date_time, lat=lat, lng=lng)
        user.deliveries.append(delivery)
        print(user.deliveries)
        response_object["message"] = f"{user_id}"
        return response_object, 201


class Deliveries(Resource):
    @deliveries_namespace.marshal_with(delivery)
    @deliveries_namespace.response(200, "Success")
    @deliveries_namespace.response(404, "delivery <delivery_id> does not exist")
    def get(self, delivery_id):
        """Returns a single delivery."""
        delivery = get_delivery_by_id(delivery_id)
        if not delivery:
            deliveries_namespace.abort(404, f"User {delivery_id} does not exist")
        return delivery, 200

    #@deliveries_namespace.expect(delivery, validate=True)
    @deliveries_namespace.response(200, "<delivery_id> was updated!")
    @deliveries_namespace.response(400, "Sorry. That email already exists.")
    @deliveries_namespace.response(404, "delivery <delivery_id> does not exist")
    def put(self, delivery_id):
        """Updates a delivery."""
        post_data = request.get_json()
        status = post_data.get("status")
        response_object = {}

        delivery = get_delivery_by_id(delivery_id)
        if not delivery:
            deliveries_namespace.abort(404, f"delivery {delivery_id} does not exist")

        update_delivery_status(delivery, status)

        response_object["message"] = f"{delivery.id} was updated!"
        return response_object, 200

    @deliveries_namespace.response(200, "<delivery_id> was removed!")
    @deliveries_namespace.response(404, "Delivery <delivery_id> does not exist")
    def delete(self, delivery_id):
        """"Deletes a Delivery."""
        response_object = {}
        delivery = get_delivery_by_id(delivery_id)

        if not delivery:
            deliveries_namespace.abort(404, f"Delivery {delivery_id} does not exist")

        delete_delivery(delivery)

        response_object["message"] = f"{delivery.id} was removed!"
        return response_object, 200

class UserDeliveries(Resource):
    @deliveries_namespace.marshal_with(delivery, as_list=True)
    def post(self):
        """Returns all deliveries of specified user."""
        post_data = request.get_json()
        token = post_data.get("token")
        user_id = User.decode_token(token)
        user = get_user_by_id(user_id)
        if not user:
            deliveries_namespace.abort(404, f"User {user_id} does not exist")
        return user.deliveries, 200


deliveries_namespace.add_resource(DeliveriesList, "")
deliveries_namespace.add_resource(Deliveries, "/<int:delivery_id>")
deliveries_namespace.add_resource(UserDeliveries, "/user")