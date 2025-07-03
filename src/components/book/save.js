import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap'; // Importing Button from react-bootstrap

const Save = () => {
  const { id } = useParams();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkSavedStatus = () => {
      axios
        .get(`http://localhost:8888/backendapi/users/bookstatus/${id}`)
        .then((response) => {
          if (response.status === 201) {
            // Status 200 indicates that the book is saved
            setIsSaved(true);
          } else {
            // Status code other than 200, assume the book is not saved
            setIsSaved(false);
          }
        })
        .catch((error) => {
          // Any error in the request, assume the book is not saved
          setIsSaved(false);
        });
    };
    checkSavedStatus();
  }, [id]);

  const saveBook = () => {
    axios
      .post(`http://localhost:8888/backendapi/users/savebook/${id}`)
      .then((response) => {
        console.log(response.data);
        // Update state to reflect that the book is saved
        setIsSaved(true);
      })
      .catch((error) => {
        console.error('Book Not Saved', error);
      });
  };

  const deleteBook = () => {
    axios
      .delete(`http://localhost:8888/backendapi/users/deletebook/${id}`)
      .then((response) => {
        console.log(response.data);
        // Update state to reflect that the book is deleted
        setIsSaved(false);
      })
      .catch((error) => {
        console.error('Book Not Deleted', error);
      });
  };

  const handleToggle = () => {
    if (isSaved) {
      // If item is already saved, delete it
      deleteBook();
    } else {
      // If item is not saved, save it
      saveBook();
    }
    // Toggle the saved state
    setIsSaved(!isSaved);
  };

  return (
    <Button
      variant={isSaved ? 'danger' : 'primary'} // Toggle between primary and danger button styles
      onClick={handleToggle}
    >
      {isSaved ? 'Unsave' : 'Save'} {/* Change the button text based on the state */}
    </Button>
  );
};

export default Save;
