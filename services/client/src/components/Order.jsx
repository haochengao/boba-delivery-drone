import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import DateTimePicker from 'react-datetime-picker'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const google_maps_api_key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;



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
    handleOrderSubmit = () => {
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
        
      console.log('submitted')
      this.setState({
        submitted: true
      })
    };
    handleLocationUpdate = (e) => {
      this.setState({
        latLng: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        }
      })
    }
    handleDateTimeUpdate = (d) => {
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
        <div className='columns is-vcentered'>
          <div className='column is-one-fifth' style={{paddingLeft:40}}>
            <h3 className='title is-2'>Choose Location:</h3>
            <hr />
            <h3 className='title is-2'>Choose Time:</h3>
            <DateTimePicker onChange={self.handleDateTimeUpdate} value={this.state.dateTime} minDate={new Date()} clearIcon={null} />
            <hr />
            <button className="button is-large" onClick={this.handleOrderSubmit}>Submit</button>
          </div>
          <div className='column is-offset-1' style={{paddingLeft:59, margin:0}}>
            <LoadScript googleMapsApiKey={google_maps_api_key}>
              <div>
                <GoogleMap
                  mapContainerStyle={{height: '92vh', width: '100%'}}
                  center={{lat: 38.0672371465638, lng: -78.7114382450141}}
                  zoom={15}
                  onClick={this.handleLocationUpdate}
                >
                    <Marker position={this.state.latLng} title="Delivery Location" />
                </GoogleMap>
              </div>
            </LoadScript>
          </div>
        </div>
      );
    }
  }
  
  Order.propTypes = {
    isAuthenticated: PropTypes.func.isRequired,
  };
  
  export default Order;