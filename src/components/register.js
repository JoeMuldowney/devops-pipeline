import React, { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    passwordConfirm: '',
    cardNumber: '',
    expiryDate: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowAlert(false);
    setLoading(true);

    if (step === 1) {
      if (formData.password !== formData.passwordConfirm) {
        setShowAlert(true);
        setLoading(false);
        return;
      }
      setStep(2);
      setLoading(false);
    } else if (step === 2) {
      try {
        // First API call: Register user
        const response = await axios.post('http://localhost:8888/backendapi/users/membership/', {
          firstname: formData.firstName,
          lastname: formData.lastName,
          username: formData.username,
          password1: formData.password,
          password2: formData.passwordConfirm
        });

        const userId = response.data.user_id;
        setUserId(userId);

        // Second API call: Register payment
        await axios.post('http://localhost:8888/cart/membershipcard', {
          first_name: formData.firstName,
          last_name: formData.lastName,
          card_num: formData.cardNumber,
          exp_date: formData.expiryDate,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          pay_default: true,
          user_id: userId
        });

              await axios.post('http://localhost:8888/cart/address', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        ship_default: true,
        user_id: userId
      });
        
        navigate('/');
      } catch (err) {
        console.error(err);
        setError('Registration failed. Please try again.');
      }
      setLoading(false);
    }
      
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col xs={12} md={8} lg={6} className="mx-auto p-4 shadow rounded bg-white">
          <h3 className="text-center mb-4">{step === 1 ? 'Register' : 'Credit Card Information'}</h3>
          {showAlert && <Alert variant="danger">Passwords do not match</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            {step === 1 ? (
              <>
                <Form.Group controlId="formFirstName" className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter first name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="formLastName" className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter last name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="formUsername" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" placeholder="Enter username" name="username" value={formData.username} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Enter password" name="password" value={formData.password} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="formPasswordConfirm" className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" placeholder="Confirm password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} required />
                </Form.Group>
              </>
            ) : (
              <>
                <Form.Group controlId="formCardNumber" className="mb-3">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control type="text" placeholder="Enter credit card number" name="cardNumber" value={formData.cardNumber} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="formExpiryDate" className="mb-3">
                  <Form.Label>Expiry Date (MM/YY)</Form.Label>
                  <Form.Control type="text" placeholder="MM/YYYY" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="formStreet" className="mb-3">
                  <Form.Label>Street</Form.Label>
                  <Form.Control type="text" placeholder="123 Main St" name="street" value={formData.street} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="formCity" className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" placeholder="City" name="city" value={formData.city} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="formState" className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control type="text" placeholder="State" name="state" value={formData.state} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="formZipCode" className="mb-4">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control type="text" placeholder="Zip Code" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                </Form.Group>
              </>
            )}

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? 'Submitting...' : step === 1 ? 'Next' : 'Register'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
