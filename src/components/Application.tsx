import React, { useEffect, useState } from "react";
import Footer from "./global/Footer";
import { useBreadcrumbsUpdater } from "./breadcrumbs/BreadcrumbsContext";
import { useParams } from "react-router-dom";
import api from "../API/api";

const mockItems = [
  {
    id: 1,
    name: "Загрузка...",
    date: 0,
    imageFilePath: "/gif/loading-11.gif",
  },
  {
    id: 2,
    name: "Загрузка...",
    date: 0,
    imageFilePath: "/gif/loading-11.gif",
  },
  {
    id: 3,
    name: "Загрузка...",
    date: 0,
    imageFilePath: "/gif/loading-11.gif",
  },
];

const Application: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [applications, setApplications] = useState(mockItems);
  const updateBreadcrumbs = useBreadcrumbsUpdater();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const response = await api.get(`/application/${id}`);
        setApplications(response.data.events);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setTimeout(() => {
          getEvents();
        }, 2000);
      }
    };

    getEvents();

    updateBreadcrumbs([
      { name: "Главная", path: "/" },
      { name: "История", path: "/history" },
      { name: "Заявка", path: `/application/${id}` },
    ]);
  }, []);

  return (
    <div>
      <div className="container mt-3">
      <h2 className="text-center mb-4">Заявка</h2>
        {applications.map((event) => (
          <div key={event.id} className="card mb-3">
            <div className="row no-gutters">
              <div className="col-md-2">
                <img
                  src={
                    event.imageFilePath === "/gif/loading-11.gif"
                      ? "/Frontend-RIP/gif/loading-11.gif"
                      : event.imageFilePath
                      ? `http://192.168.0.13:9000/rip/${event.imageFilePath}`
                      : "/Frontend-RIP/photos/error-404.png"
                  }
                  className="card-img"
                  alt={event.imageFilePath}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="col-md-4">
                <div className="card-body" style={{ maxHeight: "150px" }}>
                  <h5 className="card-title">{event.name}</h5>
                  <p className="card-text">Дата: {event.date}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Application;
