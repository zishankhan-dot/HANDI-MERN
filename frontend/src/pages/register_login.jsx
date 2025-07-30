import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import "./register-clean.css";
import axios from '../api/axios.instance';

const Register = () => {
  const [form, setForm] = useState({ Name: '', Email: '', PhoneNumber: 0, Password: '', ConfirmPassword: '' });
  const [otpverify, setoptverify] = useState("");
  const [user, setuser] = useState("Register") //Register , otp verify ,  Login
  const [otpsent, setotpsent] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // post request when user Registering 
  const handleRegister = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('/User/newUser', form);
      console.log('Status:', response.status);
      console.log('Data:', response.data);
      console.log('Full response object:', response);
      setMessage('Please verify Otp !!')
      setuser("otp")
      console.log(user);
      setotpsent(true)
      console.log("Registration successful. Moving to OTP phase.");

    } catch (err) {
      console.error(err)
      setMessage('Registration failed: ' + err.response?.data?.message);
    }
  };

  //post request to verify 6-digit otp 
  const handleotp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('User/verifyotp', { otp: otpverify, PhoneNumber: form.PhoneNumber });
      setMessage("Otp verified  successfully !!")
      setuser("Login")
      console.log("OTP verified. Moving to login.");

    }
    catch (err) {
      setMessage("Otp Verification Failed !!")
    }
  }

  //post request for login to check credentials 
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('User/Login', { Email: form.Email, Password: form.Password });
      setMessage("Login Successful Navigating to Menu")

      // Store user data and token in localStorage for cart functionality
      if (response.data && response.data.user) {
        const userData = {
          id: response.data.user.id || response.data.user._id,
          name: response.data.user.Name,
          email: response.data.user.Email,
          phone: response.data.user.PhoneNumber
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Store JWT token for authenticated requests
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
      }

      navigate("/Dashboard")

    }
    catch (err) {
      setMessage("Login Failed  !!")
    }
  }

  return (
    <Container fluid className="register-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="shadow-lg border-0 register-card">
            <Card.Body className="p-4 p-md-5">
              {user === 'Register' && (
                <>
                  <div className="text-center mb-4">
                    <h1 className="brand-title"> Handi</h1>
                    <p className="text-muted">Create your account</p>
                  </div>

                  <div className="toggle-buttons mb-4">
                    <Button
                      variant={user === 'Register' ? 'primary' : 'outline-primary'}
                      onClick={() => setuser('Register')}
                    >
                      Register
                    </Button>
                    <Button
                      variant={user === 'Login' ? 'primary' : 'outline-primary'}
                      onClick={() => setuser('Login')}
                    >
                      Login
                    </Button>
                  </div>

                  <Form onSubmit={handleRegister}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="Name"
                        placeholder="Enter your full name"
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="Email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="number"
                        name="PhoneNumber"
                        placeholder="Enter your phone number"
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="Password"
                        placeholder="Create a password"
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="ConfirmPassword"
                        placeholder="Confirm your password"
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <div className="d-grid">
                      <Button type="submit" variant="primary" size="lg">
                        Register Account
                      </Button>
                    </div>

                    {message && (
                      <Alert variant="info" className="mt-3">
                        {message}
                      </Alert>
                    )}
                  </Form>
                </>
              )}

              {user === 'Login' && (
                <>
                  <div className="text-center mb-4">
                    <h1 className="brand-title"> Handi </h1>
                    <p className="text-muted">Welcome back!</p>
                  </div>

                  <div className="toggle-buttons mb-4">
                    <Button
                      variant={user === 'Register' ? 'primary' : 'outline-primary'}
                      onClick={() => setuser('Register')}
                    >
                      Register
                    </Button>
                    <Button
                      variant={user === 'Login' ? 'primary' : 'outline-primary'}
                      onClick={() => setuser('Login')}
                    >
                      Login
                    </Button>
                  </div>

                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        onChange={(e) => { setForm({ ...form, Email: e.target.value }) }}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        onChange={(e) => { setForm({ ...form, Password: e.target.value }) }}
                        required
                      />
                    </Form.Group>

                    <div className="d-grid">
                      <Button type="submit" variant="primary" size="lg">
                        Login
                      </Button>
                    </div>

                    {message && (
                      <Alert variant="info" className="mt-3">
                        {message}
                      </Alert>
                    )}
                  </Form>
                </>
              )}

              {user === 'otp' && (
                <>
                  <div className="text-center mb-4">
                    <h1 className="brand-title"> Handi Express</h1>
                    <p className="text-muted">Verify your phone number</p>
                  </div>

                  <Form onSubmit={handleotp}>
                    <Form.Group className="mb-4">
                      <Form.Label>Enter OTP</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter 6-digit OTP"
                        onChange={e => setoptverify(e.target.value)}
                        required
                        className="text-center fs-4"
                      />
                      <Form.Text className="text-muted">
                        We've sent a verification code to your phone number
                      </Form.Text>
                    </Form.Group>

                    <div className="d-grid">
                      <Button type="submit" variant="success" size="lg">
                        Verify OTP
                      </Button>
                    </div>

                    {message && (
                      <Alert variant="info" className="mt-3">
                        {message}
                      </Alert>
                    )}
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
