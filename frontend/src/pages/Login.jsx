import { useState } from "react";
import api from "../services/apiClient";
import { Form, Button, Container, Alert } from "react-bootstrap";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      onLogin(res.data.user);
    } catch (err) {
      setMsg("Invalid email or password");
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "400px" }}>
      {msg && <Alert>{msg}</Alert>}
      <h3>Login</h3>
      <Form>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button className="mt-3" onClick={handleLogin}>
          Login
        </Button>
      </Form>
    </Container>
  );
}
