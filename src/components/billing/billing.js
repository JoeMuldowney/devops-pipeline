import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Toolbar from '../toolbar'; // Import the Toolbar component

const Billing = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [payment_type, setPayment] = useState('');
  const [card_num, setCardNum] = useState('');
  const [exp_date, setExpDate] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip_code, setZipCode] = useState('');
  const [userId, setUserId] = useState();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get('http://localhost:8888/backendapi/users/logstatus/');
        if (response.status === 200) {
          setUserId(response.data.user_id);
        }
      } catch (error) {
        console.error('Not able to retrieve user', error);
      }
    };
    getUser();
  }, []);

  const addCard = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8888/cart/addcard', {
      first_name: firstName,
      last_name: lastName,
      card_num: card_num,
      payment_type: payment_type,
      exp_date: exp_date,
      street: street,
      city: city,
      state: state,
      zip_code: zip_code,
      user_id: userId
    }).then(response => {
      console.log("Card added successfully");
      navigate('/cards');
    }).catch(error => {
      console.error('Card Not Saved', error);
    });
  };

  const handleCardNum = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    value = value.slice(0, 19);
    setCardNum(value);
  };

  const handleExpDate = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 6);
    }
    value = value.slice(0, 7);
    setExpDate(value);
  };

  return (
    <div className="container mt-5 pt-5">
        <Toolbar />
      <h2 className="mb-4">Add Billing Information</h2>
      <form onSubmit={addCard}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Billing First Name:</label>
            <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Billing Last Name:</label>
            <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Payment Type:</label>
            <input type="text" className="form-control" value={payment_type} onChange={(e) => setPayment(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Card Number:</label>
            <input type="text" className="form-control" placeholder="0000 0000 0000 0000" value={card_num} onChange={handleCardNum} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Expiration Date:</label>
            <input type="text" className="form-control" placeholder="MM/YYYY" value={exp_date} onChange={handleExpDate} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Street Address:</label>
            <input type="text" className="form-control" value={street} onChange={(e) => setStreet(e.target.value)} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">City:</label>
            <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label">State:</label>
            <input type="text" className="form-control" value={state} onChange={(e) => setState(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label">ZIP Code:</label>
            <input type="text" className="form-control" value={zip_code} onChange={(e) => setZipCode(e.target.value)} />
          </div>
        </div>

        <div className="d-flex gap-3">
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/cards')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default Billing;
