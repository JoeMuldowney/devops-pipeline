import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Toolbar from '../toolbar'; // Import the Toolbar component


const Shipping = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState();
  const [address, setAddress] = useState([
    {
      id: 0,
      first_name: '',
      last_name: '',
      street: '',
      city: '',
      state: '',
      zip_code: '',
      ship_default: false
    }
  ]);

  const [shippingAddress, setShippingAddress] = useState({
    first_name: '',
    last_name: '',
    street: '',
    city: '',
    state: '',
    zip_code: '',
    ship_default: false
  });

  const back = () => navigate('/store', { state: { userId } });
  const addAddress = () => navigate('/address');

  useEffect(() => {
    const getBilling = async () => {
      try {
        const userResponse = await axios.get('http://localhost:8000/backendapi/users/logstatus');
        const userId = userResponse.data.user_id;
        setUserId(userId);

        const resp = await axios.get('http://localhost:8020/shipping', {
          params: { user: userId }
        });

        const response = await axios.get('http://localhost:8020/allshipping', {
          params: { user: userId }
        });

        if (response.data != null) {
          setAddress(response.data);
          setShippingAddress(resp.data);
        }

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    getBilling();
  }, []);

  const setAddressClick = (id) => {
    axios
      .put('http://localhost:8020/updateshipping', { withCredentials: true }, {
        params: { user: userId, id }
      })
      .then(() => {
        console.log('Address Changed');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Address Not Changed', error);
      });
  };

  return (
    <div className="container my-5 pt-5">
        <Toolbar />
      <h2 className="text-center">Shipping Addresses</h2>
      <p className="text-center text-muted">Click on an address to make it your current shipping address</p>

      <div className="row text-center fw-bold border-bottom pb-2">
        <div className="col-md-5">Street</div>
        <div className="col-md-2">City</div>
        <div className="col-md-2">State</div>
        <div className="col-md-3">ZIP Code</div>
      </div>

      {address.map((addr, index) => (
        <div key={index} className="row text-center py-2 border-bottom" style={{ cursor: 'pointer' }}
             onClick={() => setAddressClick(addr.id)}>
          <div className="col-md-5">{addr.street}</div>
          <div className="col-md-2">{addr.city}</div>
          <div className="col-md-2">{addr.state}</div>
          <div className="col-md-3">{addr.zip_code}</div>
        </div>
      ))}

      <div className="mt-5 p-4 border rounded bg-light">
        <h4 className="text-center">Current Shipping Address</h4>
        <p className="text-center">
          {shippingAddress.first_name} {shippingAddress.last_name}<br />
          {shippingAddress.street}<br />
          {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip_code}
        </p>
      </div>

      <div className="d-flex justify-content-center gap-3 mt-4">
        <button className="btn btn-secondary" onClick={back}>Back</button>
        <button className="btn btn-primary" onClick={addAddress}>Add Address</button>
      </div>
    </div>
  );
};

export default Shipping;
