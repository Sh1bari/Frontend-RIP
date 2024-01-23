import React, { useEffect, useState } from "react";
import Event from "../models/Event";
import EventCard from "./EventCard";
import Footer from "./global/Footer";
import { useBreadcrumbsUpdater } from "./breadcrumbs/BreadcrumbsContext";
import Mock from "./mock/Mock";

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventName, setEventName] = useState("");
  const [eventStatus, setEventStatus] = useState("ACTIVE");
  const [online, setOnline] = useState("off");

  const updateBreadcrumbs = useBreadcrumbsUpdater();

  useEffect(() => {
    // Проверьте, что здесь правильные хлебные крошки
    setEvents(Mock);
    updateBreadcrumbs([{ name: "Главная", path: "/" }]);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEventName(event.target.value);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEventStatus(event.target.value);
  };

  useEffect(() => {
    const fetchEvents = async (searchName: string, status: string) => {
      try {
        const response = await fetch(
          "http://localhost:8082/api/events?eventName=" +
            searchName +
            "&eventStatus=" +
            status
        );
        const data = await response.json();
        setEvents(data.events.content);
        setOnline("on");
      } catch (error) {
        setEvents(Mock);
        console.error("Error fetching events:", error);
        setTimeout(() => {
          fetchEvents(eventName, eventStatus);
        }, 2000);
      }
    };

    fetchEvents(eventName, eventStatus);
  }, [eventName, eventStatus]);
  return (
    <div>
      <div className="container mt-3">
        <h2 className="text-center">Мероприятия</h2>

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
                  value={eventName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="eventStatusFilter">Статус мероприятия:</label>
                <select
                  className="form-control"
                  id="eventStatusFilter"
                  name="status"
                  value={eventStatus}
                  onChange={handleStatusChange}
                >
                  <option value="ACTIVE">Активные</option>
                  <option value="ARCHIVED">В архиве</option>
                </select>
              </div>
            </form>
          </div>
        </div>

        {online == "off" ? (
          <>
            <div className="row justify-content-center">
              {events.map((event) =>
                event.name.toLocaleLowerCase().includes(eventName.toLocaleLowerCase()) && (event.status == eventStatus ) ? (
                  <EventCard key={event.id} event={event} />
                ) : null
              )}
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
