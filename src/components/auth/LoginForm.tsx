import React, { useState } from "react";
import api from "../../API/api.ts";
import { showErrorNotification } from "../global/notificationService.ts";
import { useDispatch } from "react-redux";
import { setAuthenticated, setRole } from "../../redux/authSlice.ts";

interface LoginFormProps {
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const handleShowError = (msg: string) => {
    showErrorNotification(msg);
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Отправляем POST-запрос с данными формы
      const response = await api.post("/logIn", formData);

      // Обрабатываем успешный ответ
      dispatch(
        setAuthenticated({ isAuthenticated: true, username: formData.username })
      );
      dispatch(setRole(response.data.role));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      // Закрываем модальное окно

      onClose();
    } catch (error: any) {
      if (error.response) {
        if (
          error.response &&
          (error.response.status === 400 || error.response.status === 401)
        ) {
          handleShowError("Неправильный логин или пароль");
        }
      }
    }
    console.log("Отправка данных формы:", formData);
    // Закройте модальное окно
    onClose();
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
        <button
          type="submit"
          style={{ backgroundColor: "#0000CD", borderColor: "#1a5276" }}
          className="btn btn-primary"
        >
          Вход
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
