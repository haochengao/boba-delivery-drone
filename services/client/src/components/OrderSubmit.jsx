import React from "react";
import PropTypes from "prop-types";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import { Formik } from "formik";
import * as Yup from "yup";
import { Redirect } from "react-router-dom";

const OrderSubmit = (props) => {
  return (
    <div>
      <h1 className="title is-1">Confirm Order</h1>
      <div className="columns">
          <div className="column is-6">
            <LoadScript googleMapsApiKey="AIzaSyC2Cjel59eToCArKZViIQyc1vALEw0UGNU">
              <div>
                <GoogleMap
                  mapContainerStyle={{height: '75vh', width: '100%'}}
                  center={props.latLng}
                  zoom={15}
                >
                    <Marker position={props.latLng} title="Delivery Location" />
                </GoogleMap>
              </div>
            </LoadScript>
          </div>
          <div className="column is-6">
            <p>{props.dateTime.toLocaleString()}</p>
          </div>

      </div>
      <button className="button" onClick={props.handleDecrementStep}>
        Previous
      </button>
      <button className="button" onClick={props.handleSubmit}>
        Submit
      </button>
    </div>
  );
};

OrderSubmit.propTypes = {
  handleDecrementStep: PropTypes.func.isRequired,
};

export default OrderSubmit;
