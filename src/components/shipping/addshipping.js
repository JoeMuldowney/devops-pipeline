import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Toolbar from '../toolbar'; // Import the Toolbar component


const AddAddress = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip_code, setZipCode] = useState('');
  const [default_ship, setDefaultShip] = useState(false);
  const [userId, setUserId] = useState();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/backendapi/users/logstatus/');
        if (response.status === 200) {
          setUserId(response.data.user_id);
        }
      } catch (error) {
        console.error('Not able to retrieve user', error);
      }
    };
    getUser();
  }, []);

  const addAddress = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8020/address', {
      first_name: firstName,
      last_name: lastName,
      street: street,
      city: city,
      state: state,
      zip_code: zip_code,
      user_id: userId
    })
      .then(() => {
        console.log("Address Added!");
        navigate('/ship');
      })
      .catch(error => {
        console.error('Address Not Saved', error);
      });
  };

  return (
    <div className="container mt-5 pt-5">
        <Toolbar />
      <h2 className="text-center mb-4">Add Shipping Address</h2>
      <form onSubmit={addAddress}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input type="text" className="form-control" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input type="text" className="form-control" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Street</label>
          <input type="text" className="form-control" placeholder="Street" value={street} onChange={(e) => setStreet(e.target.value)} required />
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">City</label>
            <input type="text" className="form-control" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">State</label>
            <input type="text" className="form-control" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">ZIP Code</label>
            <input type="text" className="form-control" placeholder="12345" value={zip_code} onChange={(e) => setZipCode(e.target.value)} required />
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/ship')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddAddress;
