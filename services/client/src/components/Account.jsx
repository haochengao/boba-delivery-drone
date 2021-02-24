import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { GoogleMap, LoadScript } from '@react-google-maps/api';
const google_maps_api_key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveries: [],
      email: "",
      username: "",
    };
  }
  componentDidMount() {
    this.getUserStatus();
    this.getUserDeliveries();
  }
  getUserDeliveries = () => {
    this.props.isAuthenticated();
    const token = window.localStorage.getItem("refreshToken");
    const url = `${process.env.REACT_APP_API_SERVICE_URL}/deliveries/user`;
    const test = {
      token: token,
      lat: 0,
      lng: 0,
    };
    axios
      .post(url, test)
      .then((res) => {
        this.setState({
          deliveries: res.data
        });
      })
      .catch((err) => {
        console.log(err)
      });
  };
  
  getUserStatus(event) {
    const options = {
      url: `${process.env.REACT_APP_API_SERVICE_URL}/auth/status`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.accessToken}`,
      },
    };
    return axios(options)
      .then((res) => {
        this.setState({
          email: res.data.email,
          username: res.data.username,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    if (!this.props.isAuthenticated()) {
      return <Redirect to="/login" />;
    }
    return (
      <div className='columns is-vcentered'>
        <div className='column is-one-fifth' style={{paddingLeft:40}}>
          <h3 className='title is-3'>
            Your Orders
          </h3>
          <hr />
          <h5 className='subtitle is-6'>
            When order status is "In Progress", you will be able to view your order's current location.
          </h5>
          <div style={{height:'50vh', width:'40vh', overflowY:'scroll', overflowX:'auto'}}>
            <table className="table is-hoverable is-narrow">
              <thead>
                <tr>
                  <th>Estimated Delivery Date</th>
                  <th>Order Status</th>
                  {this.props.isAuthenticated() && <th />}
                </tr>
              </thead>
              <tbody>
                {this.state.deliveries.map((delivery) => {
                  return (
                    <tr key={delivery.id}>
                      <td>{new Date(delivery.end_date_time).toLocaleDateString("en-US") + ", " + new Date(delivery.end_date_time).toLocaleTimeString("en-US")}</td>
                      <td>{delivery.status == 0 ? "Planned" : (delivery.status == 1 ? "In Progress" : "Finished")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className='column is-offset-1' style={{paddingLeft:60, margin:0}}>
          <LoadScript googleMapsApiKey={google_maps_api_key}>
            <div>
              <GoogleMap
                mapContainerStyle={{height: '92vh', width: '100%'}}
                center={{lat: 38.0672371465638, lng: -78.7114382450141}}
                zoom={15}
              />
            </div>
          </LoadScript>
        </div>
      </div>
    );
    return (
      <div>
        <ul>
          <li>
            <span data-testid="user-username">{this.state.username}'s Orders</span>
          </li>
        </ul>
        <div>
          <table className="table is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>Delivery ID</th>
                <th>Order Placed</th>
                <th>Estimated Delivery Date</th>
                <th>Order Status</th>
                {this.props.isAuthenticated() && <th />}
              </tr>
            </thead>
            <tbody>
              {this.state.deliveries.map((delivery) => {
                return (
                  <tr key={delivery.id}>
                    <td>{delivery.id}</td>
                    <td>{new Date(delivery.placed_date_time).toLocaleDateString("en-US") + ", " + new Date(delivery.placed_date_time).toLocaleTimeString("en-US")}</td>
                    <td>{new Date(delivery.end_date_time).toLocaleDateString("en-US") + ", " + new Date(delivery.end_date_time).toLocaleTimeString("en-US")}</td>
                    <td>{delivery.status == 0 ? "Planned" : (delivery.status == 1 ? "In Progress" : "Finished")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      
    );
  }
}

Account.propTypes = {
  accessToken: PropTypes.string,
  isAuthenticated: PropTypes.func.isRequired,
};

export default Account;
