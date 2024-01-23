import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthenticated, setRole } from "../../redux/authSlice.ts";
import api from "../../API/api.ts";
import { showErrorNotification } from "../global/notificationService.ts";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.auth.role);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const applicationId = useSelector(
    (state: RootState) => state.auth.applicationId
  );
  const username = useSelector((state: RootState) => state.auth.username);

  const dispatch = useDispatch();

  const handleShowError = (msg: string) => {
    showErrorNotification(msg);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
    document.body.classList.add("modal-blur");
  };

  const handleRegisterClick = () => {
    setShowRegisterModal(true);
    document.body.classList.add("modal-blur");
  };

  const handleModalClose = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    document.body.classList.remove("modal-blur");
  };

  const handleLogoutClick = async () => {
    // Добавьте здесь логику для выхода пользователя, например, вызов экшена Redux
    console.log("Logging out...");
    try {
      // Отправляем POST-запрос с данными формы
      await api.post("/logOut");
      dispatch(setAuthenticated({ isAuthenticated: false, username: null }));
      localStorage.removeItem("token");
      localStorage.removeItem("applicationId");
      localStorage.setItem("role", "USER");
      dispatch(setRole("USER"));
    } catch (error: any) {
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 401)
      ) {
        console.error("Ошибка при отправке запроса:", error.response.data);
        handleShowError(error.response.data.message);
      }
    }
    navigate("/");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <a className="navbar-brand" href="#/">
          Мероприятия
        </a>
        <a className="navbar-brand" href="#/about">
          О нас
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {isAuthenticated ? (
              <>
                {applicationId != 0 ? (
                  <li className="nav-item">
                    <a
                      style={{
                        backgroundColor: "#0000CD",
                        borderColor: "#1a5276",
                      }}
                      className="nav-link btn btn-primary mr-5"
                      href={`#/application/${applicationId}`}
                      role="button"
                    >
                      Корзина
                    </a>
                  </li>
                ) : (
                  <li className="nav-item">
                    <a
                      className="nav-link btn btn-primary mr-5"
                      href={`#/application/${applicationId}`}
                      role="button"
                      style={{
                        pointerEvents: "none",
                        opacity: 0.6,
                        backgroundColor: "#0000CD",
                        borderColor: "#1a5276",
                      }}
                    >
                      Корзина
                    </a>
                  </li>
                )}
                <li className="nav-item">
                  {role == "ADMIN" ? (
                    <>
                      <a
                        className="nav-link btn btn-primary mr-5"
                        href="#/applications"
                        role="button"
                        style={{
                          backgroundColor: "#0000CD",
                          borderColor: "#1a5276",
                        }}
                      >
                        Заявки
                      </a>
                    </>
                  ) : (
                    <>
                      <a
                        className="nav-link btn btn-primary mr-5"
                        href="#/applications"
                        role="button"
                        style={{
                          backgroundColor: "#0000CD",
                          borderColor: "#1a5276",
                        }}
                      >
                        История
                      </a>
                    </>
                  )}
                </li>
                <li className="nav-item">
                  <span className="nav-link text-light">{username}</span>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link btn btn-danger mr-2"
                    href="#"
                    onClick={handleLogoutClick}
                  >
                    Выход
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={handleLoginClick}
                  >
                    Вход
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={handleRegisterClick}
                  >
                    Регистрация
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* Модальное окно для входа */}
      {showLoginModal && (
        <div
          className="modal"
          tabIndex={-1}
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-blur">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Вход</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={handleModalClose}
                  >
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
        <div
          className="modal "
          tabIndex={-1}
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-blur">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Регистрация</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={handleModalClose}
                  >
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
};

export default Header;
