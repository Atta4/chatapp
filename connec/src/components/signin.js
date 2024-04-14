
import React, { useState } from "react";
import "./../style/signin.css";
import axios from "axios";

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:5000/signin", formData)
      .then((response) => {
        console.log("Response from Flask API:", response.data);
        // Do something with the response if needed

        // Redirect to the chat page with the username as a parameter
        window.location.href = `/chat/${formData.username}`;
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };
   {
    return (
      <div className="Auth-form-container">
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>
            <div className="text-center">
            </div>
            <div className="form-group mt-3">
            <label>User Name</label>
            <input
              type="email"
              className="form-control mt-1"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g Jane Doe"
            />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                Submit
              </button>
            </div>
            <p className="text-center mt-2">
              Forgot <a href="#">password?</a>
            </p>
          </div>
        </form>
      </div>
    )
  }
}
export default SignIn;