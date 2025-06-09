import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Toolbar from '../toolbar'; // Import the Toolbar component


const BillInfo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [userId, setUserId] = React.useState(null);

  const back = () => navigate('/store', { state: { userId } });

  const addCardClick = () => {
    navigate('/bill', { state: { userId } });
  };

  const [cards, setCards] = useState([]);

  const [mainCard, setMainCard] = useState({
    first_name: '',
    last_name: '',
    card_num: '',
    payment_type: '',
    exp_date: '',
    pay_default: true
  });

  useEffect(() => {
    const getBilling = async () => {
      try {
        const userResponse = await axios.get('http://localhost:8000/backendapi/users/logstatus');
        const userId = userResponse.data.user_id;
        setUserId(userId);

        const billingResp = await axios.get('http://localhost:8020/billing', {
          params: { user: userId }
        });

        const cardsResp = await axios.get('http://localhost:8020/allcard', {
          params: { user: userId }
        });

        if (cardsResp.data) {
          setCards(cardsResp.data);
        }

        if (billingResp.data) {
          setMainCard(billingResp.data);
        }

        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    getBilling();
  }, []);

  const setCardClick = (id) => {
    axios
      .put(
        'http://localhost:8020/updatecard',
        { withCredentials: true },
        { params: { user: userId, id } }
      )
      .then(() => {
        console.log('Card Changed');
        window.location.reload();
      })
      .catch((err) => {
        console.error('Card Not Changed', err);
      });
  };

  return (
    <div className="container my-5 pt-5">
        <Toolbar />
      <h2 className="text-center mb-4">Payment Methods</h2>
      <p className="text-center text-muted">Click on a card to make it your current payment method</p>

      <div className="table-responsive mb-4">
        <table className="table table-hover text-center">
          <thead className="thead-light">
            <tr>
              <th>Type</th>
              <th>Ending In</th>
              <th>Exp</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card, index) => (
              <tr key={index} onClick={() => setCardClick(card.id)} style={{ cursor: 'pointer' }}>
                <td>{card.payment_type}</td>
                <td>{card.card_num}</td>
                <td>{card.exp_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title text-center">Payment Card In Use</h4>
          <p className="card-text text-center">
            {mainCard.first_name} {mainCard.last_name}<br />
            {mainCard.payment_type}<br />
            Ending In: {mainCard.card_num} Exp: {mainCard.exp_date}
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-center gap-3">
        <button className="btn btn-secondary" onClick={back}>Back</button>
        <button className="btn btn-primary" onClick={addCardClick}>Add Card</button>
      </div>
    </div>
  );
};

export default BillInfo;
