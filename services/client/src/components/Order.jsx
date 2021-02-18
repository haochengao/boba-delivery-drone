import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import OrderLocation from "./OrderLocation";
import OrderTime from "./OrderTime";
import OrderSubmit from "./OrderSubmit";
import { date } from "yup";


class Order extends Component {
    constructor(props) {
      super(props);
      this.state = {
        step: 0,
        latLng: {
          lat: null,
          lng: null,
        },
        dateTime: new Date(),
        submitted: false,
      };
    }
    onOrderSubmit = () => {
      this.props.isAuthenticated();
      const token = window.localStorage.getItem("refreshToken");
      const url = `${process.env.REACT_APP_API_SERVICE_URL}/deliveries`;
      const test = {
        id: null,
        token: token,
        placed_date_time: null,
        start_date_time: null,
        end_date_time: this.state.dateTime,
        status: null,
        lat: this.state.latLng.lat,
        lng: this.state.latLng.lng,
      };
      axios
        .post(url, test)
        .then((res) => {
          console.log(res.data.message)
          this.props.createMessage("success", "Order submitted")
        })
        .catch((err) => {
          this.props.createMessage("danger", "Error, Try again")
          console.log(err)
        });
      // field in users associated with the orders
      // new table of deliveries
      // order placed time, order end time, order start time, order status, user_id, order_id
      // order_submit posts to the user_id and updates the array of orders
      // posts to order placed
      // const url = `${process.env.REACT_APP_API_SERVICE_URL}/auth/login`;
      // axios
      //   .post(url, data)
      //   .then((res) => {
      //     console.log(res);
      //     this.setState({ user_id: res.data.user_id, accessToken: res.data.access_token });
      //     this.getUsers();
      //     window.localStorage.setItem("refreshToken", res.data.refresh_token);
      //     this.createMessage("success", "You have logged in successfully.");
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     this.createMessage("danger", "Incorrect email and/or password.");
      //   });
      console.log('submitted')
      this.setState({
        submitted: true
      })
    };
    nextOrderStep = () => {
      this.setState({
        step: this.state.step + 1
      })
    }
    previousOrderStep = () => {
      this.setState({
        step: this.state.step - 1
      })
    }
    onLocationUpdate = (e) => {
      this.setState({
        latLng: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        }
      })
    }
    onDateTimeUpdate = (d) => {
      this.setState({
        dateTime: d
      })
    }
    render() {
      if (!this.props.isAuthenticated()) {
        return <Redirect to="/login" />;
      } else if (this.state.submitted) {
        return <Redirect to="/" />
      }
      return (
        <div>
          {
            (this.state.step == 0) ? <OrderLocation handleIncrementStep={this.nextOrderStep} handleLocationUpdate={this.onLocationUpdate} latLng={this.state.latLng} /> : 
            ((this.state.step == 1) ? <OrderTime handleDecrementStep={this.previousOrderStep} handleIncrementStep={this.nextOrderStep} dateTime={this.state.dateTime} handleDateTimeUpdate={this.onDateTimeUpdate} /> : 
            <OrderSubmit handleDecrementStep={this.previousOrderStep} latLng={this.state.latLng} dateTime={this.state.dateTime} handleSubmit={this.onOrderSubmit} />)
          }
        </div>
      );
    }
  }
  
  Order.propTypes = {
    isAuthenticated: PropTypes.func.isRequired,
  };
  
  export default Order;