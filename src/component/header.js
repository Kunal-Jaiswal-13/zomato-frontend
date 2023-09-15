import React from "react";

import "../styles/header.css";

import Modal from "react-modal";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { GoogleLogin } from "@react-oauth/google";

import jwt_decode from 'jwt-decode';

import { withRouter } from "react-router-dom";


const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "antiquewhite",
    border: "solid 1px brown",
  },
};

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      loginModalIsOpen: false,
      isLoggedIn:false,
      loggedInUser:undefined
    };
  }

  handleLogin = () => {
    this.setState({ loginModalIsOpen: true });
  };

  handleCancel = () => {
    this.setState({ loginModalIsOpen: false, loggedInUser:undefined });
  };

  responseGoogle=(response)=>{
    var decoded = jwt_decode(response.credential)
    this.setState({isLoggedIn: true, loggedInUser:decoded.name,loginModalIsOpen:false})
  }

  navigate=(path)=>{
    this.props.history.push(path);
  }

  render() {
    const { loginModalIsOpen, isLoggedIn, loggedInUser } = this.state;
    return (
      <>
        <header>
          <div id="nav-filter" className="nav  ">
            <div className="nav-items">
              <div className="nav-icon" onClick={()=>this.navigate('/')}>
                <img src="./assests/icon.jpg"  alt="Icon error" />
              </div>
              {!isLoggedIn ?
              <div className="nav-btn">
                <button className="btn1" onClick={this.handleLogin}>
                  Login
                </button>
                <button className="btn2">Create an account</button>
              </div>
              :<div className="nav-btn">
              <button className="btn1">
                {loggedInUser}
              </button>
              <button className="btn2" onClick={this.handleCancel}>Logout</button>
            </div>}
              <Modal isOpen={loginModalIsOpen} style={customStyles} appElement={document.getElementById('root')}>
                <div>
                  <h2>Login</h2>
                  <input type="text" placeholder="Email" />
                  <br />
                  <br />
                  <input type="password" placeholder="Password" />
                  <br />
                  <br />
                  <div
                    className="signup"
                    style={{ position: "absolute", left: "70px" }}
                  >
                    <button
                      style={{
                        backgroundColor: "blue",
                        color: "white",
                        border: "none",
                        padding: "5px",
                      }}
                    >
                      Login
                    </button>
                    <button
                      onClick={this.handleCancel}
                      style={{ border: "none", padding: "10px" }}
                    >
                      Cancel
                    </button>
                    <br />
                    <br />
                    <GoogleOAuthProvider clientId="964777967711-91nbi0f77p8hso82nrt7j053hlvv96bb.apps.googleusercontent.com" >
                      <GoogleLogin
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        cookiePolicy = {'single_host_origin'}
                      />
                    </GoogleOAuthProvider>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </header>
      </>
    );
  }
}

export default withRouter(Header);

