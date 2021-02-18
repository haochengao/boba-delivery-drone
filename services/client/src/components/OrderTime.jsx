import React, { useState } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import { Redirect } from "react-router-dom";
import DateTimePicker from 'react-datetime-picker'

const OrderTime = (props) => {
    
  return (
    <div>
      <h1 className="title is-1">Select Delivery Time</h1>
      <div>
        <DateTimePicker onChange={props.handleDateTimeUpdate} value={props.dateTime} minDate={new Date()} clearIcon={null} />
      </div>
      <button className="button" onClick={props.handleDecrementStep}>
        Previous
      </button>
      <button className="button" onClick={props.handleIncrementStep} disabled={props.dateTime < new Date() ? true : false}>
        Next
      </button>
    </div>
  );
};

OrderTime.propTypes = {
  handleDecrementStep: PropTypes.func.isRequired,
  handleIncrementStep: PropTypes.func.isRequired,
};

export default OrderTime;
