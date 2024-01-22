import React, { useEffect, useState } from "react";
import Event from "../models/Event";
import EventCard from "./EventCard";
import Footer from "./global/Footer";
import { useBreadcrumbsUpdater } from "./breadcrumbs/BreadcrumbsContext";
import Mock from "./mock/Mock";
import api from "../API/api";
import { useDispatch, useSelector } from "react-redux";
import {
  setApplicationId,
  setEventName,
  setEventStatus,
} from "../redux/authSlice";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { parse } from "date-fns";
import ruLocale from "date-fns/locale/ru";
import minioConfig from "../API/config";

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const dispatch = useDispatch();

  const updateBreadcrumbs = useBreadcrumbsUpdater();
  const eventNameRed = useSelector((state: RootState) => state.auth.eventName);
  const eventStatusRed = useSelector(
    (state: RootState) => state.auth.eventStatus
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const navigate = useNavigate();

  const role = useSelector((state: RootState) => state.auth.role);

  useEffect(() => {
    // Проверьте, что здесь правильные хлебные крошки

    setEvents(Mock);
    updateBreadcrumbs([{ name: "Главная", path: "/" }]);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setEventName(event.target.value));
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setEventStatus(event.target.value));
  };

  const fetchEvents = async (searchName: string, status: string) => {
    try {
      const response = await api.get(
        "/events?eventName=" + searchName + "&eventStatus=" + status
      );
      setEvents(response.data.events.content);
      dispatch(setApplicationId(response.data.applicationId));
      localStorage.setItem("applicationId", response.data.applicationId);
    } catch (error) {
      setEvents(Mock);
      console.error("Error fetching events:", error);
      setTimeout(() => {
        fetchEvents(eventNameRed, eventStatusRed);
      }, 2000);
    }
  };

  useEffect(() => {
    fetchEvents(eventNameRed, eventStatusRed);
  }, [eventNameRed, eventStatusRed, isAuthenticated]);

  const handleDeleteEvent = async (eventId: number) => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите удалить это мероприятие?"
    );

    if (confirmDelete) {
      await api.delete(`/event/${eventId}`);
      fetchEvents(eventNameRed, eventStatusRed);
    }
  };

  const handleDetailsClick = (eventId: number) => {
    // Переход на страницу деталей мероприятия с использованием useNavigate
    navigate(`/event/${eventId}`);
  };

  const [sortField, setSortField] = useState<"id" | "date" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (field: "id" | "date") => {
    setSortField(field);
    setSortOrder((prevSortOrder) =>
      field === sortField && prevSortOrder === "asc" ? "desc" : "asc"
    );
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (sortField === "id") {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
    } else if (sortField === "date") {
      const dateA = parse(a.date, "d MMMM HH:mm yyyy", new Date(), {
        locale: ruLocale,
      });
      const dateB = parse(b.date, "d MMMM HH:mm yyyy", new Date(), {
        locale: ruLocale,
      });

      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }

    return 0;
  });

  const handleAddButtonClick = async () => {
    try {
      // Получаем текущую дату и добавляем 1 час
      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 24);

      // Подготавливаем данные для отправки
      const eventData = {
        name: "",
        description: "",
        tickets: 1,
        eventTime: currentDate.toISOString(), // Преобразуем в формат строки
      };

      // Отправляем запрос на создание нового мероприятия
      const response = await api.post("/events", eventData);

      // Если запрос успешен, перенаправляем пользователя
      if (response.status === 201) {
        navigate("/event/" + response.data.id); // Замените на ваш путь
      } else {
        console.error("Ошибка при создании мероприятия");
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса", error);
    }
  };

  return (
    <div>
      <div className="container mt-3">
        <h2 className="text-center mb-4">Мероприятия</h2>

        <div className="col-13 card">
          <div className="card-body">
            <h5 className="card-title">Поиск</h5>
            <form>
              <div className="form-group">
                <label htmlFor="eventNameFilter">Имя мероприятия:</label>
                <input
                  type="text"
                  className="form-control"
                  id="eventNameFilter"
                  name="name"
                  placeholder="Введите имя"
                  value={eventNameRed ? eventNameRed : ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="eventStatusFilter">Статус мероприятия:</label>
                <select
                  className="form-control"
                  id="eventStatusFilter"
                  name="status"
                  value={eventStatusRed}
                  onChange={handleStatusChange}
                >
                  <option value="ACTIVE">Активные</option>
                  <option value="ARCHIVED">В архиве</option>
                </select>
              </div>
            </form>
          </div>
        </div>

        {role == "ADMIN" ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button
                className="btn btn-success"
                onClick={handleAddButtonClick}
              >
                Добавить
              </button>
            </div>
            <div className="admin-table">
              <table className="table">
                <thead>
                  <tr>
                    <th
                      onClick={() => handleSort("id")}
                      style={{ cursor: "pointer" }}
                    >
                      ID{" "}
                      {sortField === "id" ? (
                        sortOrder === "asc" ? (
                          <span>&#9650;</span>
                        ) : (
                          <span>&#9660;</span>
                        )
                      ) : null}
                    </th>
                    <th>Изображение</th>
                    <th>Название</th>
                    <th
                      onClick={() => handleSort("date")}
                      style={{ cursor: "pointer" }}
                    >
                      Дата{" "}
                      {sortField === "date" ? (
                        sortOrder === "asc" ? (
                          <span>&#9650;</span>
                        ) : (
                          <span>&#9660;</span>
                        )
                      ) : null}
                    </th>
                    <th>Описание</th>
                    <th>Доступные билеты</th>
                    <th>Купленные билеты</th>
                    <th>Подробнее</th>
                    <th>Удалить</th>
                    {/* Другие колонки, если нужно */}
                  </tr>
                </thead>
                <tbody>
                  {sortedEvents.map((event) => (
                    <tr key={event.id}>
                      <td>{event.id}</td>
                      <td>
                        <img
                          src={
                            event.imageFilePath
                              ? event.imageFilePath === "/gif/loading-11.gif"
                                ? "/Frontend-RIP/gif/loading-11.gif"
                                : `${minioConfig.minioUrl}:9000/rip/${event.imageFilePath}`
                              : "/Frontend-RIP/photos/error-404.png"
                          }
                          alt="Event Image"
                          style={{ height: "100px", objectFit: "cover" }}
                        />
                      </td>
                      <td>{event.name}</td>
                      <td>{event.date}</td>
                      <td>{event.description}</td>
                      <td>{event.tickets}</td>
                      <td>{event.purchasedTickets}</td>
                      <td>
                        <button
                          style={{ backgroundColor: '#0000CD', borderColor: '#1a5276' }}
                          className="btn btn-primary"
                          onClick={() => handleDetailsClick(event.id)}
                        >
                          Подробнее
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          Удалить
                        </button>
                      </td>
                      {/* Другие ячейки, если нужно */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="row justify-content-center">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
