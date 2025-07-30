import React, { useState, useEffect } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';
import './admin-clean.css';

function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminToken, setAdminToken] = useState(null);
    const [adminInfo, setAdminInfo] = useState(null);

    useEffect(() => {
        // Check if admin is already logged in
        const token = localStorage.getItem('adminToken');
        const admin = localStorage.getItem('adminInfo');
        
        if (token && admin) {
            setAdminToken(token);
            setAdminInfo(JSON.parse(admin));
            setIsAuthenticated(true);
        }
    }, []);

    const handleLoginSuccess = (token, admin) => {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminInfo', JSON.stringify(admin));
        setAdminToken(token);
        setAdminInfo(admin);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        setAdminToken(null);
        setAdminInfo(null);
        setIsAuthenticated(false);
    };

    return (
        <div className="admin-panel">
            {!isAuthenticated ? (
                //onloginsuccess is a callback function that will be called when the admin successfully logs in
                // its more like a prop that is passed to the AdminLogin component 
                //it will call handleLoginSuccess function when the admin successfully logs in
                //this will set the adminToken and adminInfo in the local storage and also update the state
                <AdminLogin onLoginSuccess={handleLoginSuccess} />
            ) : (
                <AdminDashboard 
                    token={adminToken} 
                    adminInfo={adminInfo} 
                    onLogout={handleLogout} 
                />
            )}
        </div>
    );
}

export default AdminPanel;
