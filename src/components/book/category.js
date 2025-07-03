import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
  ButtonGroup,
} from 'react-bootstrap';
import Toolbar from '../toolbar'; // Adjust if needed

function Category() {
  const { genre } = useParams();
  const [error, setError] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const bookdetailClick = (id) => {
    navigate(`/details/${id}`);
  };

  function truncateDescription(desc, maxLength = 100) {
    return desc.length > maxLength ? desc.slice(0, maxLength) + '...' : desc;
  }

  useEffect(() => {
    fetchBooks();
  }, [genre, currentPage]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8888/backendapi/books/category/${genre}/?page=${currentPage}`
      );
      if (response.status !== 200) throw new Error('Failed to fetch data');

      const processedBooks = response.data.books.map(book => ({
        ...book,
        book_description: truncateDescription(book.book_description),
      }));

      setBooks(processedBooks);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      setError('Error fetching books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <Toolbar />
      <Container className="mt-4">
        <h3 className="mb-4 text-capitalize">{genre} Books</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <Spinner animation="border" className="d-block mx-auto my-5" />
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {books.map((book) => (
              <Col key={book.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title
                      style={{ cursor: 'pointer' }}
                      onClick={() => bookdetailClick(book.id)}
                    >
                      {book.title}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Stars: {book.score || 'N/A'}
                    </Card.Subtitle>
                    <Card.Text
                      style={{ cursor: 'pointer' }}
                      onClick={() => bookdetailClick(book.id)}
                    >
                      {book.book_description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="d-flex justify-content-between">
                    <small>Stock: {book.stock}</small>
                    <small>Buy: ${book.buy_amount}</small>
                    <small>Rent: ${book.rent_amount}</small>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Pagination Controls */}
        <div className="d-flex justify-content-center mt-5">
          <ButtonGroup>
            <Button
              variant="outline-secondary"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button variant="light" disabled>
              Page {currentPage} of {totalPages}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </ButtonGroup>
        </div>
      </Container>
    </div>
  );
}

export default Category;
