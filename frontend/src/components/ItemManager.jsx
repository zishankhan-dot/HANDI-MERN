import React, { useState } from 'react';
import { Button, Modal, Form, Card, Row, Col, Alert } from 'react-bootstrap';

function ItemManager({ token, items, onRefresh, loading }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', price: '' });
        setEditingItem(null);
        setShowAddForm(false);
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price)
                })
            });

            const data = await response.json();
            if (data.success) {
                onRefresh();
                resetForm();
                alert('Item added successfully!');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            alert('Error adding item: ' + error.message);
        }
    };

    const handleEditItem = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/api/items/${editingItem._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price)
                })
            });

            const data = await response.json();
            if (data.success) {
                onRefresh();
                resetForm();
                alert('Item updated successfully!');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            alert('Error updating item: ' + error.message);
        }
    };

    const handleDeleteItem = async (itemId, itemName) => {
        if (!window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                onRefresh();
                alert('Item deleted successfully!');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            alert('Error deleting item: ' + error.message);
        }
    };

    const startEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price.toString()
        });
        setShowAddForm(true);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <h4>🔄 Loading items...</h4>
            </div>
        );
    }

    return (
        <div className="item-manager">
            <div className="manager-header">
                <h2> Item Management</h2>
                <Button 
                    variant="success"
                    onClick={() => setShowAddForm(true)}
                    className="add-btn"
                >
                    + Add New Item
                </Button>
            </div>

            <Modal show={showAddForm} onHide={resetForm} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingItem ? 'Edit Item' : 'Add New Item'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={editingItem ? handleEditItem : handleAddItem}>
                        <Form.Group className="mb-3">
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter item name"
                                required
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter item description"
                                required
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-4">
                            <Form.Label>Price (€)</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                required
                            />
                        </Form.Group>
                        
                        <div className="d-flex gap-2 justify-content-end">
                            <Button 
                                variant="secondary" 
                                onClick={resetForm}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="success" 
                                type="submit"
                            >
                                {editingItem ? '💾 Update Item' : '➕ Add Item'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <div className="items-grid">
                {items.length === 0 ? (
                    <div className="no-items">
                        <Alert variant="info" className="text-center">
                            <h5> No items found</h5>
                            <p>Add your first menu item to get started!</p>
                        </Alert>
                    </div>
                ) : (
                    items.map(item => (
                        <Card key={item._id} className="item-card h-100">
                            <Card.Body>
                                <Card.Title className="h5">{item.name}</Card.Title>
                                <Card.Text className="text-muted">{item.description}</Card.Text>
                                <div className="item-price mb-3">€{item.price}</div>
                                <div className="item-actions">
                                    <Button 
                                        variant="primary"
                                        size="sm"
                                        onClick={() => startEdit(item)}
                                        className="me-2"
                                    >
                                         Edit
                                    </Button>
                                    <Button 
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeleteItem(item._id, item.name)}
                                    >
                                         Delete
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

export default ItemManager;
