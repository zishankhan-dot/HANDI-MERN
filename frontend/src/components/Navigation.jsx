import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import './Navigation-bootstrap.css';

function Navigation() {
    const location = useLocation();
    const { getCartItemCount } = useCart();
    
    // Don't show navigation on admin pages for security
    if (location.pathname.includes('admin')) {
        return null;
    }

    return (
        <Navbar expand="lg" className="main-navigation" fixed="top">
            <Container>
                <Navbar.Brand as={Link} to="/dashboard" className="nav-logo fw-bold">
                     Handi 
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link 
                            as={Link} 
                            to="/dashboard" 
                            className={location.pathname === '/dashboard' ? 'nav-link active' : 'nav-link'}
                        >
                            Menu
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/cart" 
                            className={location.pathname === '/cart' ? 'nav-link active' : 'nav-link'}
                        >
                             Cart {getCartItemCount() > 0 && (
                                <Badge bg="danger" className="ms-1">
                                    {getCartItemCount()}
                                </Badge>
                            )}
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/authenticate" 
                            className={location.pathname === '/authenticate' ? 'nav-link active' : 'nav-link'}
                        >
                            Account
                        </Nav.Link>
                        
                        {/* Hidden admin link - only visible if you know the path */}
                        <div className="admin-access d-none d-lg-block" style={{ opacity: 0.1, fontSize: '10px' }}>
                            <Nav.Link as={Link} to="/admin-portal-secure" className="admin-link">
                                Admin
                            </Nav.Link>
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;
