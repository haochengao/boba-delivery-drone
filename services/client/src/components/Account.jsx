import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Redirect } from "react-router-dom";
import socketIOClient from "socket.io-client";

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
    const socket = socketIOClient(`${process.env.REACT_APP_SOCKET_SERVICE_URL}`);
    console.log('got here');
    socket.on("message", data => {
        console.log('location received')
        .catch((err) => {
          console.log(err);
          console.log('test1');
        });
    })
    socket.emit("message", {message: 'test'});
  }
  // getUserDeliveries = () => {
  //   this.props.isAuthenticated();
  //   const options = {
  //     url: `${process.env.REACT_APP_API_SERVICE_URL}/deliveries/user`,
  //     method: "get",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${this.props.accessToken}`,
  //     },
  //   };
  //   return axios(options)
  //     .then((res) => {
  //       console.log(res.data)
  //       this.setState({
  //         deliveries: res.data
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }
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
