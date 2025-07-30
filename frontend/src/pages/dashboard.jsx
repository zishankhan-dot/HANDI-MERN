import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import "./index.css"

function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const { addToCart } = useCart();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/items');
      const data = await response.json();
      
      if (data.success) {
        setItems(data.data);
      } else {
        setError('Failed to fetch items');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    setToastMessage(`${item.name} added to cart!`);
    setShowToast(true);
  };

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center loading">
        <Spinner animation="border" variant="primary" size="lg" className="mb-3" />
        <h4>Loading delicious items...</h4>
      </div>
    </Container>
  );
  
  if (error) return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Alert variant="danger" className="error text-center">
        <Alert.Heading>Oops! Something went wrong</Alert.Heading>
        <p>{error}</p>
      </Alert>
    </Container>
  );
  
  return (
    <div>
      {/* Hero Section */}
      <Container fluid className="hero">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-3 fw-bold mb-4">Authentic Handi at Your Doorstep</h1>
              <p className="lead fs-4">Freshly made, deeply flavoured—ready to eat!</p>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* Menu Section */}
      <Container className="my-5">
        <Row className="g-4">
          {items.map((item) => (
            <Col key={item._id} xl={4} lg={6} md={6} sm={12}>
              <Card className="dish h-100 border-0 shadow-lg">
                <div className="position-relative overflow-hidden">
                  <Card.Img 
                    variant="top" 
                    src={`images/${item.name.toLowerCase().replace(/\s+/g, '-')}.jpg`} 
                    alt={item.name}
                    className="dish-image"
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                </div>
                <Card.Body className="text-center p-4">
                  <Card.Title as="h3" className="fw-bold mb-3">{item.name}</Card.Title>
                  <Card.Text className="text-muted mb-4">{item.description}</Card.Text>
                  <div className="h4 fw-bold text-primary mb-4">€{item.price}</div>
                  <Button 
                    className="order-btn btn-lg px-4 py-2 fw-bold text-uppercase"
                    variant="success"
                    onClick={() => handleAddToCart(item)}
                  >
                     Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Footer */}
      <footer className="mt-5">
        <Container>
          <Row className="text-center">
            <Col>
              <p className="mb-2">📞 0123-456-789 | 📍 Dublin, Ireland</p>
              <p className="mb-0">&copy; 2025 Handi Express</p>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Toast Notification */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={3000} 
          autohide
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">Cart Updated</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default Dashboard;
