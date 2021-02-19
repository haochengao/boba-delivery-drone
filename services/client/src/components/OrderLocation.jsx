import React from "react";
import PropTypes from "prop-types";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Formik } from "formik";
import * as Yup from "yup";
import { Redirect } from "react-router-dom";

const google_maps_api_key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const styles = {
    secondaryContainer: {
      marginTop: '20px',
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "400",
    },
  }

const OrderLocation = (props) => {

  return (
    <div>
        <h1 className="title is-1">Select Delivery Location</h1>
        <h3 className="subtitle is-5">Please select an open area, delivery only precise within ~10 feet.
        <br />Only available in certain region of Crozet, VA.
        </h3>
        <LoadScript googleMapsApiKey={google_maps_api_key}>
          <div>
            <GoogleMap
              mapContainerStyle={{height: '75vh', width: '100%'}}
              center={{lat: 38.0672371465638, lng: -78.7114382450141}}
              zoom={15}
              onClick={props.handleLocationUpdate}
            >
                <Marker position={props.latLng} title="Delivery Location" />
            </GoogleMap>
          </div>
        </LoadScript>
        <button className="button" disabled={props.latLng.lat == null ? true : false} onClick={props.handleIncrementStep}>
            Next
        </button>
    </div>
  );
};

OrderLocation.propTypes = {
  handleIncrementStep: PropTypes.func.isRequired,
  handleLocationUpdate: PropTypes.func.isRequired,
};

export default OrderLocation;
