import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import axios from '../api/axios.instance';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/Order/all');
      
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(`/Order/status/${orderId}`, {
        status: newStatus
      });

      if (response.data.success) {
        // Update the order in the local state
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus }
            : order
        ));
        
        // Update selected order if it's the one being viewed
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setStatusUpdate(order.status);
    setShowDetailsModal(true);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'new': return 'primary';
      case 'preparing': return 'warning';
      case 'ready': return 'info';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateItemsCount = (items) => {
    return items.reduce((total, item) => total + item.qty, 0);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" size="lg" />
        <h4 className="mt-3">Loading orders...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mx-3">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={fetchOrders}>
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <div className="order-manager">
      <div className="manager-header">
        <h2> Order Management</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={fetchOrders}>
             Refresh
          </Button>
        </div>
      </div>

      {orders.length === 0 ? (
        <Alert variant="info" className="text-center">
          <h5> No orders found</h5>
          <p>Orders will appear here once customers start placing them.</p>
        </Alert>
      ) : (
        <Card>
          <Card.Header>
            <h5 className="mb-0">All Orders ({orders.length})</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <Table responsive striped hover className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <code>#{order._id.slice(-6)}</code>
                    </td>
                    <td>
                      <div>
                        <div className="fw-bold">{order.customerName}</div>
                        <small className="text-muted">{order.phone}</small>
                      </div>
                    </td>
                    <td>
                      <Badge bg={order.type === 'delivery' ? 'info' : 'secondary'}>
                        {order.type === 'delivery' ? ' Delivery' : ' Collection'}
                      </Badge>
                    </td>
                    <td>
                      <span className="fw-bold">{calculateItemsCount(order.items)}</span>
                      <small className="text-muted"> items</small>
                    </td>
                    <td>
                      <span className="fw-bold text-success">€{order.totalPrice}</span>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <small>{formatDate(order.createdAt)}</small>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => viewOrderDetails(order)}
                        >
                           View
                        </Button>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <Form.Select
                            size="sm"
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            style={{ width: '120px' }}
                          >
                            <option value="new">New</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </Form.Select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Order Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
             Order Details #{selectedOrder?._id.slice(-6)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h6>Customer Information</h6>
                  <p className="mb-1"><strong>Name:</strong> {selectedOrder.customerName}</p>
                  <p className="mb-1"><strong>Phone:</strong> {selectedOrder.phone}</p>
                  <p className="mb-1">
                    <strong>Type:</strong> 
                    <Badge bg={selectedOrder.type === 'delivery' ? 'info' : 'secondary'} className="ms-2">
                      {selectedOrder.type === 'delivery' ? ' Delivery' : ' Collection'}
                    </Badge>
                  </p>
                  {selectedOrder.type === 'delivery' && (
                    <p className="mb-1"><strong>Address:</strong> {selectedOrder.address}</p>
                  )}
                </div>
                <div className="col-md-6">
                  <h6>Order Information</h6>
                  <p className="mb-1"><strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                  <p className="mb-1"><strong>Payment:</strong> {selectedOrder.paymentMethod || 'Card'}</p>
                  <p className="mb-1">
                    <strong>Status:</strong> 
                    <Badge bg={getStatusVariant(selectedOrder.status)} className="ms-2">
                      {selectedOrder.status.toUpperCase()}
                    </Badge>
                  </p>
                  <p className="mb-1">
                    <strong>Total:</strong> 
                    <span className="text-success fw-bold ms-2">€{selectedOrder.totalPrice}</span>
                  </p>
                </div>
              </div>

              <h6>Order Items</h6>
              <Table striped bordered size="sm">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td>€{item.price}</td>
                      <td>€{(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-info">
                    <th colSpan="3">Total</th>
                    <th>€{selectedOrder.totalPrice}</th>
                  </tr>
                </tfoot>
              </Table>

              {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                <div className="mt-4">
                  <h6>Update Status</h6>
                  <div className="d-flex gap-2">
                    <Form.Select
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                      style={{ width: '200px' }}
                    >
                      <option value="new">New</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                    <Button
                      variant="success"
                      onClick={() => {
                        updateOrderStatus(selectedOrder._id, statusUpdate);
                        setShowDetailsModal(false);
                      }}
                    >
                      Update Status
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderManager;
