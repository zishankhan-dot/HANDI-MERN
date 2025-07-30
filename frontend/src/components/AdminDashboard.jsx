import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Badge } from 'react-bootstrap';
import ItemManager from './ItemManager';
import AdminManager from './AdminManager';
import OrderManager from './OrderManager';

function AdminDashboard({ token, adminInfo, onLogout }) {
    const [activeTab, setActiveTab] = useState('items');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/items');
            const data = await response.json();
            
            if (data.success) {
                setItems(data.data);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshItems = () => {
        fetchItems();
    };

    return (
        <Container fluid className="admin-dashboard">
            <Row>
                <Col xs={12}>
                    <Card className="mb-4 border-0 shadow-sm">
                        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                            <div>
                                <h2 className="mb-1 h3"> Admin Dashboard</h2>
                                <Badge bg="light" text="dark" className="fs-6">Welcome, {adminInfo.name}</Badge>
                            </div>
                            <Button variant="outline-light" onClick={onLogout} size="sm">
                                 Logout
                            </Button>
                        </Card.Header>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <Nav variant="tabs" className="mb-4">
                        <Nav.Item>
                            <Nav.Link 
                                active={activeTab === 'items'} 
                                onClick={() => setActiveTab('items')}
                                className="d-flex align-items-center px-4 py-3"
                            >
                                 Manage Items
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link 
                                active={activeTab === 'orders'} 
                                onClick={() => setActiveTab('orders')}
                                className="d-flex align-items-center px-4 py-3"
                            >
                                 Manage Orders
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link 
                                active={activeTab === 'admins'} 
                                onClick={() => setActiveTab('admins')}
                                className="d-flex align-items-center px-4 py-3"
                            >
                                 Manage Admins
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <div className="admin-content">
                        {activeTab === 'items' && (
                            <ItemManager 
                                token={token} 
                                items={items} 
                                onRefresh={refreshItems}
                                loading={loading}
                            />
                        )}
                        {activeTab === 'orders' && (
                            <OrderManager 
                                token={token}
                            />
                        )}
                        {activeTab === 'admins' && (
                            <AdminManager 
                                token={token} 
                                currentAdmin={adminInfo}
                            />
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminDashboard;
