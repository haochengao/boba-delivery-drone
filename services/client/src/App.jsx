import React, { Component } from "react";
import axios from "axios";
import { Route, Switch, Link } from "react-router-dom";
import Modal from "react-modal";

import About from "./components/About";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Account from "./components/Account";
import Message from "./components/Message";
import AddUser from "./components/AddUser";
import Order from "./components/Order";
import Main from "./components/Main";
import Boba from "./components/images/boba.jpg";
import "./App.css";

const modalStyles = {
  content: {
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    border: 0,
    background: "transparent",
  },
};

Modal.setAppElement(document.getElementById("root"));


class App extends Component {
  constructor() {
    super();

    this.state = {
      user_id: null,
      users: [],
      title: "Boba Delivery",
      accessToken: null,
      messageType: null,
      messageText: null,
      showModal: false,
    };
  }

  componentDidMount = () => {
    this.getUsers();
  };

  addUser = (data) => {
    axios
      .post(`${process.env.REACT_APP_API_SERVICE_URL}/users`, data)
      .then((res) => {
        this.getUsers();
        this.setState({ username: "", email: "" });
        this.handleCloseModal();
        this.createMessage("success", "User added.");
      })
      .catch((err) => {
        // console.log(err);
        this.handleCloseModal();
        this.createMessage("danger", "That user already exists.");
      });
  };

  createMessage = (type, text) => {
    this.setState({
      messageType: type,
      messageText: text,
    });
    setTimeout(() => {
      this.removeMessage();
    }, 3000);
  };

  getUsers = () => {
    axios
      .get(`${process.env.REACT_APP_API_SERVICE_URL}/users`)
      .then((res) => {
        this.setState({ users: res.data });
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  handleLoginFormSubmit = (data) => {
    const url = `${process.env.REACT_APP_API_SERVICE_URL}/auth/login`;
    axios
      .post(url, data)
      .then((res) => {
        this.setState({accessToken: res.data.access_token });
        this.getUsers();
        window.localStorage.setItem("refreshToken", res.data.refresh_token);
        this.createMessage("success", "You have logged in successfully.");
      })
      .catch((err) => {
        // console.log(err);
        this.createMessage("danger", "Incorrect email and/or password.");
      });
  };

  handleOpenModal = () => {
    this.setState({ showModal: true });
  };

  handleRegisterFormSubmit = (data) => {
    const url = `${process.env.REACT_APP_API_SERVICE_URL}/auth/register`;
    axios
      .post(url, data)
      .then((res) => {
        // console.log(res.data);
        this.createMessage("success", "You have registered successfully.");
      })
      .catch((err) => {
        // console.log(err);
        this.createMessage("danger", "That user already exists.");
      });
  };

  isAuthenticated = () => {
    if (this.state.accessToken || this.validRefresh()) {
      return true;
    }
    return false;
  };

  logoutUser = () => {
    window.localStorage.removeItem("refreshToken");
    this.setState({ accessToken: null });
    this.createMessage("success", "You have logged out.");
  };

  removeMessage = () => {
    this.setState({
      messageType: null,
      messageText: null,
    });
  };

  removeUser = (user_id) => {
    axios
      .delete(`${process.env.REACT_APP_API_SERVICE_URL}/users/${user_id}`)
      .then((res) => {
        this.getUsers();
        this.createMessage("success", "User removed.");
      })
      .catch((err) => {
        // console.log(err);
        this.createMessage("danger", "Something went wrong.");
      });
  };

  validRefresh = () => {
    const token = window.localStorage.getItem("refreshToken");
    if (token) {
      axios
        .post(`${process.env.REACT_APP_API_SERVICE_URL}/auth/refresh`, {
          refresh_token: token,
        })
        .then((res) => {
          this.setState({ accessToken: res.data.access_token });
          this.getUsers();
          window.localStorage.setItem("refreshToken", res.data.refresh_token);
          return true;
        })
        .catch((err) => {
          return false;
        });
    }
    return false;
  };

  render() {
    return (
      <div style={{backgroundColor: "#c2a78c"}}>
        <NavBar
          // title={this.state.title}
          logoutUser={this.logoutUser}
          isAuthenticated={this.isAuthenticated}
        />
        <div className="container">
          {this.state.messageType && this.state.messageText && (
              <Message
                messageType={this.state.messageType}
                messageText={this.state.messageText}
                removeMessage={this.removeMessage}
              />
          )}
        </div>
        <section className="hero is-fullheight-with-navbar" style={{margin:0, height: 100, padding:0, backgroundImage: `url(${Boba})`, backgroundPosition: 'right', backgroundRepeat: 'no-repeat',}}>
        <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <div className="hero-body">
                    <Main
                      accessToken={this.state.accessToken}
                      isAuthenticated={this.isAuthenticated}
                    />
                  </div>
                )}
              />
              <Route 
                exact 
                path="/about" 
                render={() => (
                  <div className='hero-body'>
                    <About />
                  </div>
                )}
              />
              <Route
                exact
                path="/register"
                render={() => (
                  <div className='hero-body'>
                    <RegisterForm
                      // eslint-disable-next-line react/jsx-handler-names
                      handleRegisterFormSubmit={this.handleRegisterFormSubmit}
                      isAuthenticated={this.isAuthenticated}
                    />
                  </div>
                )}
              />
              <Route
                exact
                path="/login"
                render={() => (
                  <div className="hero-body">
                    <LoginForm
                      // eslint-disable-next-line react/jsx-handler-names
                      handleLoginFormSubmit={this.handleLoginFormSubmit}
                      isAuthenticated={this.isAuthenticated}
                    />
                  </div>
                )}
              />
              <Route
                exact
                path="/account"
                render={() => (
                  <div className='hero-title'>
                    <Account
                      accessToken={this.state.accessToken}
                      isAuthenticated={this.isAuthenticated}
                      users={this.state.users}
                    />
                  </div>
                )}
              />
              <Route
                exact
                path="/order"
                render={() => (
                  <div clasName="hero-title">
                    <Order
                      accessToken={this.state.accessToken}
                      isAuthenticated={this.isAuthenticated}
                      user_id={this.state.user_id}
                      createMessage={this.createMessage}
                    />
                  </div>
                )}
              />
        </Switch>
        </section>
        <footer className="footer has-text-centered">
                By <a className='footera' href="https://www.haochengao.com">Haochen Gao</a>. Boba and delivery both provided free of charge, on condition that the service is only operated on the creator's whim.
                <br />
                <a className='footera' href="https://github.com/haochengao/boba-delivery-drone">Source Code</a>
        </footer>
      </div>
    );
  }
}

export default App;
