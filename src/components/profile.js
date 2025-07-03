import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Toolbar from './toolbar'; // Import the Toolbar component

function Profile() {
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [profileDesc, setProfileDesc] = useState('');
  const [favoriteBook, setFavoriteBook] = useState('');
  const [currentBook, setCurrentBook] = useState('');
  const [favoriteAuthor, setFavoriteAuthor] = useState('');
  const [favoriteGenre, setFavoriteGenre] = useState('');
  const [publicProfile, setPublicProfile] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:8888/backendapi/users/viewprofile/');
        const profileData = response.data;
        setProfileDesc(profileData.profileDesc);
        setFavoriteBook(profileData.favoriteBook);
        setCurrentBook(profileData.currentBook);
        setFavoriteAuthor(profileData.favoriteAuthor);
        setFavoriteGenre(profileData.favoriteGenre);
        setPublicProfile(profileData.publicProfile);
        setView(profileData.publicProfile ? 'Yes' : 'No');
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('No profile data found.');
      }
    };
    fetchProfileData();
  }, []);

  const handleToggle = () => {
    setPublicProfile(!publicProfile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8888/backendapi/users/memberprofile/', {
        profileDesc,
        favoriteBook,
        currentBook,
        favoriteAuthor,
        favoriteGenre,
        publicProfile,
      });
      window.location.reload();
    } catch (error) {
      setError('Errors happened');
    }
  };

  const makeChanges = (e) => {
    e.preventDefault();
    setEdit(true);
  };

  return (
    <div className="container mt-4 pt-5">
        <Toolbar />
      
      <form onSubmit={edit ? handleSubmit : makeChanges}>
        {!edit ? (
          <>
            <div className="mb-3">
              <label className="form-label fw-bold">About Me:</label>
              <p>{profileDesc}</p>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Favorite Book:</label>
                <p>{favoriteBook}</p>
                <label className="form-label">Currently Reading:</label>
                <p>{currentBook}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Favorite Author:</label>
                <p>{favoriteAuthor}</p>
                <label className="form-label">Favorite Genre:</label>
                <p>{favoriteGenre}</p>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Public Profile:</label>
              <p>{view}</p>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary me-2">Edit</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/store")}>Cancel</button>
          </>
        ) : (
          <>
            <div className="mb-3">
              <label className="form-label fw-bold">About Me:</label>
              <textarea
                className="form-control"
                placeholder="Profile Description"
                value={profileDesc}
                onChange={(e) => setProfileDesc(e.target.value)}
                rows="5"
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Favorite Book:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Favorite Book"
                  value={favoriteBook}
                  onChange={(e) => setFavoriteBook(e.target.value)}
                />
                <label className="form-label mt-2">Currently Reading:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Currently Reading"
                  value={currentBook}
                  onChange={(e) => setCurrentBook(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Favorite Author:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Favorite Author"
                  value={favoriteAuthor}
                  onChange={(e) => setFavoriteAuthor(e.target.value)}
                />
                <label className="form-label mt-2">Favorite Genre:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Favorite Genre"
                  value={favoriteGenre}
                  onChange={(e) => setFavoriteGenre(e.target.value)}
                />
              </div>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={publicProfile}
                onChange={handleToggle}
                id="publicProfileCheckbox"
              />
              <label className="form-check-label" htmlFor="publicProfileCheckbox">
                Make profile public
              </label>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-success me-2">Save</button>
            <button type="button" className="btn btn-secondary" onClick={() => setEdit(false)}>Cancel</button>
          </>
        )}
      </form>
    </div>
  );
}

export default Profile;
