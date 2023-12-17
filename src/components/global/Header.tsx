
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import LoginForm from '../auth/LoginForm';
import RegisterForm from '../auth/RegisterForm';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthenticated } from '../../redux/authSlice.ts';

const Header: React.FC = () => {

  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const username = useSelector((state: RootState) => state.auth.username);

  const handleLoginClick = () => {
    setShowLoginModal(true);
    document.body.classList.add('modal-blur');
  };

  const handleRegisterClick = () => {
    setShowRegisterModal(true);
    document.body.classList.add('modal-blur');
  };

  const handleModalClose = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    document.body.classList.remove('modal-blur');
  };
  const dispatch = useDispatch();

  const handleLogoutClick = () => {
    // Добавьте здесь логику для выхода пользователя, например, вызов экшена Redux
    console.log('Logging out...');
    dispatch(setAuthenticated({ isAuthenticated: false, username: null }));
    navigate('/');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <a className="navbar-brand" href="#/">Мероприятия</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="#" onClick={handleLogoutClick}>{username}</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#" onClick={handleLogoutClick}>Выход</a>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={handleLoginClick}>Вход</button>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={handleRegisterClick}>Регистрация</button>
                </li>
              </>
            )}
            <li className="nav-item">
              <a className="nav-link" href="#/about">О нас</a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Модальное окно для входа */}
      {showLoginModal && (
        <div className="modal" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
          <div className="modal-blur">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Вход</h5>
                  <button type="button" className="close" onClick={handleModalClose}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <LoginForm onClose={handleModalClose} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно для регистрации */}
      {showRegisterModal && (
        <div className="modal " tabIndex={-1} role="dialog" style={{ display: 'block' }}>
          <div className="modal-blur">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Регистрация</h5>
                  <button type="button" className="close" onClick={handleModalClose}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <RegisterForm onClose={handleModalClose} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;