import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Link } from "react-router-dom";


class Main extends Component {
    constructor(props) {
      super(props);
      this.state = {
        email: "",
        username: "",
      };
    }
    componentDidMount() {
      this.getUserStatus();
    }
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
        return (
            <div>
                <h1 className="title is-1">Automated Boba Delivery Via Drone</h1>
                <hr />
                <br />
                <div>
                    <Link to="/register" className="button">
                    Register
                    </Link>
                    <Link to="/login" className="button">
                    Log In
                    </Link>
                </div>
            </div>
        );
      }
      return (
        <div>
            <h1 className="title is-1">Automated Coffee Delivery Via Drone</h1>
            <hr />
            <br />
            <div>
                <Link to="/order" className="button">
                    Order Now
                </Link>
            </div>
        </div>
      );
    }
  }
  
  Main.propTypes = {
    accessToken: PropTypes.string,
    isAuthenticated: PropTypes.func.isRequired,
  };
  
  export default Main;