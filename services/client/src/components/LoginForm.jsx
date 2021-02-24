import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import { Redirect, Link } from "react-router-dom";

import "./form.css";

const LoginForm = (props) => {
  if (props.isAuthenticated()) {
    return <Redirect to="/" />;
  }
  return (
  // <div className='columns is-vcentered'>
  //   <div className='column is-5'>
  //     <section className="hero is-halfheight">
  //       <h1 className="title is-1">
  //         Get Boba Delivered By Drone
  //         <br />
  //         <br />
  //         <Link to="/order" className="button is-large">
  //           Get Started
  //         </Link>
  //       </h1>
  //     </section>
  //   </div>
  // </div>
    <div>
      <h1 className="title is-1">Sign In</h1>
      <hr />
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          props.handleLoginFormSubmit(values);
          resetForm();
          setSubmitting(false);
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Enter a valid email.")
            .required("Email is required."),
          password: Yup.string().required("Password is required."),
        })}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
          } = props;
          return (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label" htmlFor="input-email">
                  Email
                </label>
                <input
                  name="email"
                  id="input-email"
                  className={
                    errors.email && touched.email ? "input error" : "input"
                  }
                  type="email"
                  placeholder="Enter an email address"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}
              </div>
              <div className="field">
                <label className="label" htmlFor="input-password">
                  Password
                </label>
                <input
                  name="password"
                  id="input-password"
                  className={
                    errors.password && touched.password
                      ? "input error"
                      : "input"
                  }
                  type="password"
                  placeholder="Enter a password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </div>
              <input
                type="submit"
                className="button is-large"
                value="Submit"
                disabled={isSubmitting}
              />
            </form>
          );
        }}
      </Formik>
      <hr />
      <Link to="/register">
        No Account? Sign Up Here.
      </Link>
    </div>
  );
};

LoginForm.propTypes = {
  handleLoginFormSubmit: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired,
};

export default LoginForm;
