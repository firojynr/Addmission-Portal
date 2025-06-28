import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:3400/login", {
        email,
        password,
      });

      const token = res?.data?.token;
      if (!token) {
        setMessage("Login failed: Token not received from server.");
        return;
      }

      localStorage.setItem("token", token);
      setMessage("✅ Login successful!");

      const userRes = await axios.get("http://localhost:3400/application", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("User Data:", userRes.data);

      // Redirect
      navigate("/application-form");
    } catch (error) {
      console.error("Login Error:", error);
      const errMsg =
        error.response?.data ||
        error.message ||
        "❌ Something went wrong during login.";
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleLogin}>
      <h4 className="text-center mb-4">Login</h4>

      <Form.Group className="mb-3" controlId="formEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Button
        type="submit"
        className="w-100"
        variant="success"
        disabled={loading}
      >
        {loading ? <Spinner animation="border" size="sm" /> : "Login"}
      </Button>

      {message && (
        <Alert
          variant={message.includes("✅") ? "success" : "danger"}
          className="mt-3"
        >
          {message}
        </Alert>
      )}
    </Form>
  );
}

export default Login;
