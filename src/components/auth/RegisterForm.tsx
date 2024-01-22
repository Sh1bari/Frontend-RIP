import React, { useState } from "react";
import api from "../../API/api.ts";
import { showErrorNotification } from "../global/notificationService.ts";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../../redux/authSlice.ts";

interface RegisterFormProps {
  onClose: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onClose }) => {
  const dispatch = useDispatch();

  const handleShowError = (msg: string) => {
    showErrorNotification(msg);
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    patronymic: "",
    userGroup: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Добавьте здесь логику для обработки данных формы, например, отправка на сервер
    try {
      // Отправляем POST-запрос с данными формы
      const response = await api.post("/registration", formData);

      // Обрабатываем успешный ответ
      dispatch(
        setAuthenticated({
          isAuthenticated: true,
          username: response.data.username,
        })
      );
      localStorage.setItem("token", response.data.token);

      // Закрываем модальное окно
      onClose();
    } catch (error: any) {
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 401)
      ) {
        console.error("Ошибка при отправке запроса:", error.response.data);
        handleShowError(error.response.data.message);
      }
    }
    // Закройте модальное окно
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Имя пользователя</label>
        <input
          type="text"
          className="form-control"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Пароль</label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Повтор пароля</label>
        <input
          type="password"
          className="form-control"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="firstName">Имя</label>
        <input
          type="text"
          className="form-control"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="lastName">Фамилия</label>
        <input
          type="text"
          className="form-control"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="patronymic">Отчество</label>
        <input
          type="text"
          className="form-control"
          id="patronymic"
          name="patronymic"
          value={formData.patronymic}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="userGroup">Группа</label>
        <input
          type="text"
          className="form-control"
          id="userGroup"
          name="userGroup"
          value={formData.userGroup}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <button
          type="submit"
          style={{ backgroundColor: "#0000CD", borderColor: "#1a5276" }}
          className="btn btn-primary"
        >
          Зарегистрироваться
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
