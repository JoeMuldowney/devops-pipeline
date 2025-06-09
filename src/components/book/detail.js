import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Col, Row, Container, Card, Alert } from 'react-bootstrap';
import Toolbar from '../toolbar';  // Make sure the path to your Toolbar is correct
import ToggleButton from './save';
import CartToggleButton from './add';

const Detail = () => {
  const [book, setBook] = useState({
    id: 0,
    title: '',
    book_description: '',
    stock: 0,
    buy_amount: 0.0,
    rent_amount: 0.0,
  });
  const [buyBook, setBuyBook] = useState({
    id: 0,
    title: '',
    format: '',
    purchaseType: '',
    cost: 0.0,
    quantity: 1,
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalQuantity, setQuantityValue] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState(buyBook.format);
  const [selectedPurchaseType, setSelectedPurchaseType] = useState(buyBook.purchaseType);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/backendapi/books/view/${id}`, { withCredentials: true });
        if (response.status !== 200) {
          throw new Error('Failed to fetch data');
        }
        setBook(response.data.book);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleFormatChange = (event) => {
    setSelectedFormat(event.target.value);
    setBuyBook({ ...buyBook, format: event.target.value, title: book.title });
  };

  const handlePurchaseTypeChange = (event) => {
    let selectedValue = event.target.value;
    let price;
    if (selectedValue === 'buy') {
      price = book.buy_amount;
    } else if (selectedValue === 'rent') {
      price = book.rent_amount;
    }
    setSelectedPurchaseType(selectedValue);
    setBuyBook({ ...buyBook, purchaseType: selectedValue, cost: price });
  };

  const handleDropdownChange = (event) => {
    let selectedValue = event.target.value;
    setQuantityValue(selectedValue);
    setBuyBook({ ...buyBook, quantity: selectedValue });
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="info">Loading book details...</Alert>
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="danger">Error: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <>
      <Toolbar /> {/* Added the Toolbar component here */}

      <Container className="my-5 pt-5"> {/* Add pt-5 for top padding */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="shadow-sm h-100 p-3">
              <Card.Img variant="top" src="https://via.placeholder.com/300" alt={book.title} />
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">By {book.author}</Card.Subtitle>
                <Card.Text>{book.book_description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <h3 className="text-center">Book Purchase Options</h3>
            <p className="text-center text-muted">All fields must be filled out to purchase the book</p>
            <Form>
              <Row>
                <Col md={6}>
                  <h4>Book Format</h4>
                  <Form.Check
                    type="radio"
                    label="Paperback"
                    id="paperback"
                    name="format"
                    value="paperback"
                    checked={selectedFormat === 'paperback'}
                    onChange={handleFormatChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Hardcover"
                    id="hardcover"
                    name="format"
                    value="hardcover"
                    checked={selectedFormat === 'hardcover'}
                    onChange={handleFormatChange}
                  />
                </Col>

                <Col md={6}>
                  <h4>Purchase Type</h4>
                  <Form.Check
                    type="radio"
                    label={`Buy $${book.buy_amount}`}
                    id="buy"
                    name="purchase"
                    value="buy"
                    checked={selectedPurchaseType === 'buy'}
                    onChange={handlePurchaseTypeChange}
                  />
                  <Form.Check
                    type="radio"
                    label={`Rent $${book.rent_amount}`}
                    id="rent"
                    name="purchase"
                    value="rent"
                    checked={selectedPurchaseType === 'rent'}
                    onChange={handlePurchaseTypeChange}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <h4>Quantity</h4>
                  <Form.Group controlId="copies">
                    <Form.Label>Copies</Form.Label>
                    <Form.Control as="select" value={totalQuantity} onChange={handleDropdownChange}>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col className="text-center">
            <Button variant="secondary" onClick={() => navigate('/store')}>
              Return to Store
            </Button>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col className="text-center">
            <ToggleButton book={book} />
          </Col>
        </Row>

        {buyBook.purchaseType && buyBook.cost && buyBook.format && (
          <Row className="mb-4">
            <Col className="text-center">
              <CartToggleButton buyBook={buyBook} />
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default Detail;
