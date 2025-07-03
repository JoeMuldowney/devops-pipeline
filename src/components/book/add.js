import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, Alert } from 'react-bootstrap'; // Importing Button and Alert from react-bootstrap

const Add = (props) => {
  axios.defaults.withCredentials = true;
  const [loggedin, setLoggedIn] = useState(false);
  const { buyBook } = props;
  const { id } = useParams();
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState('');

  // Convert to integers
  const bookId = parseInt(id, 10);
  const price = parseFloat(buyBook.cost, 10);
  const amount = parseInt(buyBook.quantity);
  const [uid, setUserId] = useState(null);

  useEffect(() => {
    const fetchLogStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8888/backendapi/users/logstatus/');
        if (response.status === 200) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        setLoggedIn(false);
      }
    };

    fetchLogStatus();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First request
        const userResponse = await axios.get('http://localhost:8888/backendapi/users/logstatus');
        const userId = userResponse.data.user_id;
        setUserId(userId);

        // Second request, using the userId from the first request
        const cartResponse = await axios.get('http://localhost:8888/cart/getcartbook', {
          params: { id: id, user: userId },
        });

        if (!cartResponse.data) {
          setIsAdded(false);
        } else {
          setIsAdded(true);
        }
      } catch (error) {
        setError('Not logged in');
      }
    };

    fetchData();
  }, [id]); // Assuming `id` is a dependency

  const addBook = () => {
    axios
      .post('http://localhost:8888/cart/cart', {
        user_id: uid,
        book_id: bookId,
        title: buyBook.title,
        quantity: amount,
        format: buyBook.format,
        purchase: buyBook.purchaseType,
        cost: price,
      })
      .then((response) => {
        console.log('Book added to cart');
        setIsAdded(true);
      })
      .catch((error) => {
        console.error('Book Not Saved', error);
      });
  };

  const deleteBook = () => {
    axios
      .delete(`http://localhost:8888/cart/delete`, {
        params: { id: id, user: uid },
      })
      .then((response) => {
        setIsAdded(false);
      })
      .catch((error) => {
        console.error('Book Not Deleted', error);
      });
  };

  const handleCartToggle = () => {
    if (isAdded) {
      deleteBook();
    } else {
      addBook();
    }
    setIsAdded(!isAdded);
  };

  return (
    <div>
      {/* Bootstrap Button with dynamic classes based on isAdded */}
      <Button
        variant={isAdded ? 'danger' : 'primary'}
        onClick={handleCartToggle}
        disabled={!loggedin} // Disable button if not logged in
        style={{ fontSize: '12px' }}
      >
        {isAdded ? 'Remove from Cart' : 'Add to Cart'}
      </Button>

      {/* Show an error message if there's an error */}
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

export default Add;
