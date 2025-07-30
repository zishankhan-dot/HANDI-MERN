import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Alert, 
  ListGroup, 
  Form, 
  Modal,
  Badge,
  InputGroup
} from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios.instance';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    customerName: '',
    phone: '',
    type: 'delivery',
    address: '',
    paymentMethod: 'card'
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState('details'); // details, location, payment, success

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, parseInt(newQuantity));
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleInputChange = (e) => {
    setOrderDetails({
      ...orderDetails,
      [e.target.name]: e.target.value
    });
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Using OpenStreetMap Nominatim API for reverse geocoding (free alternative)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            
            if (data && data.display_name) {
              setOrderDetails({
                ...orderDetails,
                address: data.display_name
              });
            } else {
              setOrderDetails({
                ...orderDetails,
                address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
              });
            }
          } catch (error) {
            console.error('Error getting address:', error);
            setOrderDetails({
              ...orderDetails,
              address: `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`
            });
          } finally {
            setLocationLoading(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter your address manually.');
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setLocationLoading(false);
    }
  };

  const proceedToPayment = () => {
    if (!orderDetails.customerName || !orderDetails.phone) {
      alert('Please fill in all required details.');
      return;
    }
    
    if (orderDetails.type === 'delivery' && !orderDetails.address) {
      alert('Please provide a delivery address.');
      return;
    }
    
    setPaymentStep('payment');
  };

  const processPayment = async () => {
    setLoading(true);
    
    try {
      // Get user data and token from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      console.log('Debug - User data:', userData);
      console.log('Debug - Token:', token ? 'Token exists' : 'No token found');
      
      // Prepare order data
      const orderData = {
        customerName: orderDetails.customerName,
        phone: orderDetails.phone,
        type: orderDetails.type,
        address: orderDetails.type === 'delivery' ? orderDetails.address : 'Collection',
        items: cart.items.map(item => ({
          name: item.name,
          qty: item.quantity,
          price: item.price
        })),
        totalPrice: (cart.totalPrice + 3.50).toFixed(2),
        paymentMethod: orderDetails.paymentMethod
      };

      console.log('Debug - Order data:', orderData);

      // Prepare headers with authentication token
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      console.log('Debug - Headers:', headers);

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order in database with authentication
      const response = await axios.post('/Order/create', orderData, { headers });
      
      if (response.data.success) {
        setPaymentStep('success');
        clearCart();
        
        // Auto redirect to dashboard after 3 seconds
        setTimeout(() => {
          setShowCheckout(false);
          navigate('/dashboard');
        }, 3000);
      } else {
        throw new Error('Order creation failed');
      }
      
    } catch (error) {
      console.error('Payment/Order error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <Alert variant="info" className="p-5">
              <h2 className="mb-4"> Your Cart is Empty</h2>
              <p className="mb-4">Looks like you haven't added any delicious items to your cart yet!</p>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/dashboard')}
              >
                Browse Menu
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">🛒 Your Cart</h3>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {cart.items.map((item) => (
                  <ListGroup.Item key={item._id} className="py-3">
                    <Row className="align-items-center">
                      <Col md={6}>
                        <h5 className="mb-1">{item.name}</h5>
                        <p className="text-muted mb-1">{item.description}</p>
                        <strong className="text-success">€{item.price}</strong>
                      </Col>
                      <Col md={3}>
                        <InputGroup size="sm">
                          <Button
                            variant="outline-secondary"
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <Form.Control
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                            className="text-center"
                            min="1"
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </InputGroup>
                      </Col>
                      <Col md={2} className="text-end">
                        <div className="fw-bold mb-2">€{(item.price * item.quantity).toFixed(2)}</div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm sticky-top" style={{ top: '100px' }}>
            <Card.Header className="bg-success text-white">
              <h4 className="mb-0">Order Summary</h4>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Items ({cart.totalItems})</span>
                <span>€{cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery</span>
                <span>€3.50</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total</strong>
                <strong>€{(cart.totalPrice + 3.50).toFixed(2)}</strong>
              </div>
              
              <div className="d-grid gap-2">
                <Button
                  variant="success"
                  size="lg"
                  onClick={() => setShowCheckout(true)}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  Continue Shopping
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Checkout Modal */}
      <Modal 
        show={showCheckout} 
        onHide={() => setShowCheckout(false)} 
        size="lg" 
        centered
        backdrop="static"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        dialogClassName="custom-modal-dialog"
      >
        <Modal.Header closeButton className="text-center border-0">
          <Modal.Title className="w-100 text-center mx-auto">
            {paymentStep === 'details' && '🛍️ Order Details'}
            {paymentStep === 'payment' && '💳 Payment'}
            {paymentStep === 'success' && '✅ Order Confirmed'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {paymentStep === 'details' && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Customer Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="customerName"
                      value={orderDetails.customerName}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={orderDetails.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Order Type</Form.Label>
                <Form.Select
                  name="type"
                  value={orderDetails.type}
                  onChange={handleInputChange}
                >
                  <option value="delivery">Delivery</option>
                  <option value="collection">Collection</option>
                </Form.Select>
              </Form.Group>
              
              {orderDetails.type === 'delivery' && (
                <Form.Group className="mb-3">
                  <Form.Label>Delivery Address *</Form.Label>
                  <InputGroup>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={orderDetails.address}
                      onChange={handleInputChange}
                      placeholder="Enter your delivery address"
                      required
                    />
                    <Button
                      variant="outline-primary"
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                    >
                      {locationLoading ? 'Getting Location...' : ' Use GPS'}
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Click "Use GPS" to automatically get your current location
                  </Form.Text>
                </Form.Group>
              )}
            </Form>
          )}

          {paymentStep === 'payment' && (
            <div>
              <div className="mb-4">
                <h5>Order Summary</h5>
                <div className="border rounded p-3 bg-light">
                  {cart.items.map(item => (
                    <div key={item._id} className="d-flex justify-content-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total</span>
                    <span>€{(cart.totalPrice + 3.50).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Form.Group className="mb-3">
                <Form.Label>Payment Method</Form.Label>
                <Form.Select
                  name="paymentMethod"
                  value={orderDetails.paymentMethod}
                  onChange={handleInputChange}
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="cash">Cash on Delivery</option>
                </Form.Select>
              </Form.Group>

              {orderDetails.paymentMethod === 'card' && (
                <Alert variant="info">
                  <strong>Demo Payment:</strong> This is a demo application. 
                  No real payment will be processed.
                </Alert>
              )}
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="text-center py-4">
              <div className="mb-4">
                <div className="display-1 text-success">🎉</div>
                <h2 className="text-success mb-3">Thanks for Ordering!</h2>
                <h4 className="text-success">Order Confirmed Successfully!</h4>
              </div>
              <Alert variant="success">
                <p className="mb-2">
                  <strong>Order ID:</strong> #HD{Date.now().toString().slice(-6)}
                </p>
                <p className="mb-2">
                  <strong>Total:</strong> €{(cart.totalPrice + 3.50).toFixed(2)}
                </p>
                <p className="mb-2">
                  <strong>Customer:</strong> {orderDetails.customerName}
                </p>
                <p className="mb-0">
                  <strong>Estimated Delivery:</strong> 25-35 minutes
                </p>
              </Alert>
              <p className="text-muted">You will be redirected to the menu shortly...</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {paymentStep === 'details' && (
            <>
              <Button variant="secondary" onClick={() => setShowCheckout(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={proceedToPayment}>
                Continue to Payment
              </Button>
            </>
          )}
          {paymentStep === 'payment' && (
            <>
              <Button variant="secondary" onClick={() => setPaymentStep('details')}>
                Back
              </Button>
              <Button 
                variant="success" 
                onClick={processPayment}
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay €${(cart.totalPrice + 3.50).toFixed(2)}`}
              </Button>
            </>
          )}
          {paymentStep === 'success' && (
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              Return to Menu
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Cart;
