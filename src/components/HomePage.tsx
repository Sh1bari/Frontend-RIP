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

  useEffect(() => {
    const fetchEvents = async (searchName: string, status: string) => {
      try {
        const response = await api.get(
          "/events?eventName=" + searchName + "&eventStatus=" + status
        );
        setEvents(response.data.events.content);
        dispatch(setApplicationId(response.data.applicationId));
        localStorage.setItem('applicationId', response.data.applicationId);
      } catch (error) {
        setEvents(Mock);
        console.error("Error fetching events:", error);
        setTimeout(() => {
          fetchEvents(eventNameRed, eventStatusRed);
        }, 2000);
      }
    };

    fetchEvents(eventNameRed, eventStatusRed);
  }, [eventNameRed, eventStatusRed, isAuthenticated]);
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

        <div className="row justify-content-center">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
