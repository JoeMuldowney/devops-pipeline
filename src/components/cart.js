import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import Toolbar from './toolbar'; // Import the Toolbar component


const CheckOut = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);  
  const [error, setError] = useState(null);  
  const [totalItems, setTotalItems] = useState();
  const [totalCost, setTotalCost] = useState();
  const [buyBook, setBuyBook] = useState([{
    book_id: 0,
    title: '',
    format: '',
    purchase: '',
    cost: 0.0,
    quantity: '',
    total_cost: 0.0,
    total_items: 0
  }]);
  const [address, setAddress] = useState([{
    first_name: '',
    last_name: '',
    street: '',
    city: '',
    state: '',
    zip_code: ''
  }]); 
  const [card, setCard] = useState([{
    payment_type: '',
    card_num: '',
    exp_date: ''
  }]);

  useEffect(() => {
    const getCheckOut = async () => {
      try {
        const userResponse = await axios.get('http://localhost:8888/backendapi/users/logstatus');
        const userId = userResponse.data.user_id;
        setUserId(userId);

        const shipresponse = await axios.get(`http://localhost:8888/cart/shipping`, {
          params: { user: userId }
        });
        setAddress(shipresponse.data);

        const billresponse = await axios.get(`http://localhost:8888/cart/billing`, {
          params: { user: userId }
        });
        setCard(billresponse.data);

        const cartresponse = await axios.get(`http://localhost:8888/cart/checkout`, {
          params: { user: userId }
        });
        if (cartresponse.data.cart_items != null) {
          setBuyBook(cartresponse.data.cart_items);
          setTotalItems(cartresponse.data.total_items);
          setTotalCost(cartresponse.data.total_cost);
        }      
      } catch (error) {
        console.error('Error fetching cart books', error);
        setError('Error fetching cart books');
      }
    };
    getCheckOut();
  }, []);

  const bookdetailClick = (id) => {
    navigate(`/details/${id}`);
  };

  const clearCart = async () => {
    try {
      const bookIds = buyBook.map(book => ({ book_id: book.book_id }));
      const response = await axios.post('http://localhost:8888/backendapi/users/boughtbooks/', bookIds, { withCredentials: true });
      if (response.status === 200) {
        const deleteResponse = await axios.delete(`http://localhost:8888/cart/deleteall`, {
          params: { user: userId }
        });
        setBuyBook([]);
        setTotalItems();
        setTotalCost();
        navigate('/history');
      }
    } catch (error) {
      console.error('Error clearing cart', error);
      setError('Error clearing cart');
    }
  };
  return (
    <Container className="mt-5 pt-5">
        <Toolbar />
      <Row>
        <Col md={12}>
          <h1 className="text-center">In Cart</h1>
          <h6 className="text-center">Click on a book to change the order</h6>
        </Col>
      </Row>
      <Row className="mt-4">
        {buyBook.map((book, index) => (
          <Col xs={12} md={6} lg={4} key={index}>
            <Card>
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Text><strong>Price:</strong> {book.cost}</Card.Text>
                <Card.Text><strong>Quantity:</strong> {book.quantity}</Card.Text>
                <Card.Text><strong>Format:</strong> {book.format}</Card.Text>
                <Card.Text><strong>Purchase:</strong> {book.purchase}</Card.Text>
                <Button variant="primary" onClick={() => bookdetailClick(book.book_id)}>View Details</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-5">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <p><strong>Items:</strong> {totalItems}</p>
              <p><strong>Total:</strong> {totalCost}</p>
              <h4>Payment Method</h4>
              <p>{card.payment_type}</p>
              <p>Ending In: {card.card_num} Expires: {card.exp_date}</p>
              <h4>Ship To:</h4>
              <p>{address.first_name} {address.last_name}</p>
              <p>{address.street}</p>
              <p>{address.city} {address.state} {address.zip_code}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <div className="d-flex flex-column align-items-center">
            <Button variant="secondary" className="mb-3" onClick={() => navigate("/store")}>Return</Button>
            <Button variant="success" className="mb-3" onClick={clearCart}>Purchase</Button>
            <Button variant="warning" className="mb-3" onClick={() => navigate("/ship")}>New Address</Button>
            <Button variant="info" onClick={() => navigate("/cards")}>New Card</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckOut;
