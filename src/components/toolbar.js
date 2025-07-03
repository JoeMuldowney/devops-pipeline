import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button, Container, Offcanvas, NavDropdown } from 'react-bootstrap';


function Toolbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [loggedin, setLoggedIn] = useState(false);
  
  axios.defaults.withCredentials = true;

  // Session check on mount
  useEffect(() => {
    const fetchLogStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8888/backendapi/users/logstatus/');
          setLoggedIn(response.status === 200);
      } catch (error) {
        setLoggedIn(false);
      }
    };

    fetchLogStatus();
  }, []);

  const toggleMenu = () => setShowMenu(!showMenu);


  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8888/backendapi/users/memberlogout/');
      setLoggedIn(false);
      window.location.href = '/'; // or use useNavigate if using React Router
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" fixed="top">
        <Container>
          <Button
            variant="outline-light"
            onClick={toggleMenu}
            className="me-2"
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          >
            <i className="bi bi-list"></i>
          </Button>
          <Navbar.Brand as={Link} to="/">Book Smith</Navbar.Brand>
          <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/store">
              <Button variant="outline-light">Home</Button>
            </Nav.Link>
<Nav.Link
  as={Link}
  to={loggedin ? "/cart" : "/"}
  onClick={(e) => {
    if (!loggedin) {
      e.preventDefault();
      alert("Please log in to view your cart.");
    }
  }}
>
  <Button variant="outline-light" disabled={!loggedin}>
    Cart
  </Button>
</Nav.Link>
<NavDropdown title="Account" menuVariant="dark">
  <NavDropdown.Item
    as={Link}
    to={loggedin ? "/profile" : "/"}
    onClick={(e) => {
      if (!loggedin) {
        e.preventDefault();
        alert("Please log in to view your profile.");
      }
    }}
  >
    Profile
  </NavDropdown.Item>

  <NavDropdown.Item
    as={Link}
    to={loggedin ? "/cards" : "/"}
    onClick={(e) => {
      if (!loggedin) {
        e.preventDefault();
        alert("Please log in to access billing.");
      }
    }}
  >
    Billing
  </NavDropdown.Item>

  <NavDropdown.Item
    as={Link}
    to={loggedin ? "/ship" : "/"}
    onClick={(e) => {
      if (!loggedin) {
        e.preventDefault();
        alert("Please log in to access shipping info.");
      }
    }}
  >
    Shipping
  </NavDropdown.Item>

  <NavDropdown.Divider />
  {loggedin ? (
    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
  ) : (
    <NavDropdown.Item as={Link} to="/">Login</NavDropdown.Item>
  )}
</NavDropdown>


          </Nav>
        </Container>
      </Navbar>

      <Offcanvas show={showMenu} onHide={toggleMenu} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/history">Purchase History</Nav.Link>
            <Nav.Link as={Link} to="/saved">Saved Books</Nav.Link>
            <Nav.Link as={Link} to="/review">Reviews</Nav.Link>
            <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Toolbar;