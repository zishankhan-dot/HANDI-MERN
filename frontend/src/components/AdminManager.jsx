import React, { useState, useEffect } from 'react';

function AdminManager({ token, currentAdmin }) {
    const [admins, setAdmins] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: ''
    });

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/admin/list-admins-k3m9x7', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                setAdmins(data.data);
            }
        } catch (error) {
            console.error('Error fetching admins:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/admin/create-admin-b8n4p1-restricted', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                fetchAdmins();
                setFormData({ name: '', email: '', phoneNumber: '', password: '' });
                setShowAddForm(false);
                alert('Admin created successfully!');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            alert('Error creating admin: ' + error.message);
        }
    };

    const handleDeleteAdmin = async (adminId, adminName) => {
        if (!window.confirm(`Are you sure you want to delete admin "${adminName}"?`)) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/admin/remove-admin-q7w2e9/${adminId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                fetchAdmins();
                alert('Admin deleted successfully!');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            alert('Error deleting admin: ' + error.message);
        }
    };

    if (loading) {
        return <div className="loading">Loading admins...</div>;
    }

    return (
        <div className="admin-manager">
            <div className="manager-header">
                <h2> Admin Management</h2>
                <button 
                    className="add-btn"
                    onClick={() => setShowAddForm(true)}
                >
                    + Add New Admin
                </button>
            </div>

            {showAddForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Create New Admin</h3>
                        <form onSubmit={handleAddAdmin}>
                            <div className="form-group">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number:</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    minLength="6"
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="save-btn">
                                    Create Admin
                                </button>
                                <button 
                                    type="button" 
                                    className="cancel-btn"
                                    onClick={() => setShowAddForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="admins-list">
                {admins.length === 0 ? (
                    <div className="no-admins">
                        <p>No admins found.</p>
                    </div>
                ) : (
                    admins.map(admin => (
                        <div key={admin._id} className="admin-card">
                            <div className="admin-info">
                                <h3>
                                    {admin.Name}
                                    {admin._id === currentAdmin.id && (
                                        <span className="current-user">(You)</span>
                                    )}
                                </h3>
                                <p> {admin.Email}</p>
                                <p> {admin.PhoneNumber}</p>
                                <p> Created: {new Date(admin.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="admin-actions">
                                {admin._id !== currentAdmin.id && (
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDeleteAdmin(admin._id, admin.Name)}
                                    >
                                         Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default AdminManager;
