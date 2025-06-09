import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toolbar from './toolbar'; // Import the Toolbar component

const SavedBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  const bookDetailClick = (bookId) => {
    navigate(`/details/${bookId}`);
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get('http://localhost:8000/backendapi/users/savedbooks/');
        const processedBooks = response.data.books.map(book => ({ ...book }));
        setBooks(processedBooks);
      } catch (error) {
        console.error('Error fetching books', error);
        setError('No saved books found');
      }
    };
    fetchBook();
  }, []);

  return (
    <div className="container mt-5 pt-5">
        <Toolbar />
      <h2 className="mb-3">Virtual Library Saved Books</h2>
      <p className="text-muted">Click on a book to read more details</p>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row fw-bold border-bottom pb-2 mb-2">
        <div className="col-4 col-md-3">Review Score</div>
        <div className="col-4 col-md-5">Title</div>
        <div className="col-4 col-md-4">Author</div>
      </div>

      {books.map((book, index) => (
        <div
          key={index}
          className="row mb-2 border-bottom pb-2"
          style={{ cursor: 'pointer' }}
          onClick={() => bookDetailClick(book.id)}
        >
          <div className="col-4 col-md-3">{book.score || 'N/A'}</div>
          <div className="col-4 col-md-5">{book.title}</div>
          <div className="col-4 col-md-4">{book.author}</div>
        </div>
      ))}
    </div>
  );
};

export default SavedBook;
