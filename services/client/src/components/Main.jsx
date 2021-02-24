import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Link } from "react-router-dom";
import socketIOClient from "socket.io-client";
import Image from './images/main.png';

import './Main.css';

const styles = {
  bgimage: {
    backgroundImage: `url(${Image})`,
    alignSelf: 'stretch',
    backgroundSize: 300,
    height: 500,
    width: 500
  }
}

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
            <div className='columns is-vcentered'>
              <div className='column is-3'>
                <section className="hero is-halfheight">
                  <h1 className="title is-1">
                    Get Boba Delivered By Drone
                    <br />
                    <br />
                    <Link to="/login" className="button is-large">
                      Get Started
                    </Link>
                  </h1>
                </section>
              </div>
            </div>
        );
      }
      return (
        <div className='columns is-vcentered'>
          <div className='column is-5'>
            <section className="hero is-halfheight">
              <h1 className="title is-1">
                Get Boba Delivered By Drone
                <br />
                <br />
                <Link to="/order" className="button is-large">
                  Order Now
                </Link>
              </h1>
            </section>
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