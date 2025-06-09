import React, { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


function Home() {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const[username,setUserName] = React.useState('')
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleLogin = async (e) => {
      e.preventDefault();
       
    axios.post(
          'http://localhost:8000/backendapi/users/memberlogin/',{ username, password})
        .then(response => {
 
          navigate('/store');
        })       
      .catch(error => {
        setShowAlert('Incorrect username or password');
    });

    };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col xs={12} md={6} lg={4} className="mx-auto p-4 shadow rounded bg-white">
          <h3 className="text-center mb-4">Login</h3>
          {showAlert && <Alert variant="danger">Invalid credentials</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3">
              Login
            </Button>
          </Form>

          <div className="text-center">
            <span>Don't have an account? </span>
            <Link to="/register">Click here</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
