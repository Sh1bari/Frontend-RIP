import React, { useEffect, useState } from "react";
import Footer from "./global/Footer";
import { useBreadcrumbsUpdater } from "./breadcrumbs/BreadcrumbsContext";
import api from "../API/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  showErrorNotification,
  showSuccessNotification,
} from "./global/notificationService";
import { setApplicationId } from "../redux/authSlice";

const Bag: React.FC = () => {
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
  const dispatch = useDispatch();
  const applicationId = useSelector(
    (state: RootState) => state.auth.applicationId
  );
  const [applications, setApplications] = useState(mockItems);
  const updateBreadcrumbs = useBreadcrumbsUpdater();

  const handleShowError = (msg: string) => {
    showErrorNotification(msg);
  };

  const handleShowSuccess = (msg: string) => {
    showSuccessNotification(msg);
  };

  const fetchEvents = async (appId: any) => {
    try {
      if (appId > 0) {
        const response = await api.get(
          `/application/${
            appId ? appId : localStorage.getItem("applicationId")
          }`
        );
        setApplications(response.data.events);
        console.log(response.data.events);
      } else {
        setApplications([]);
      }
    } catch (error: any) {
      handleShowError(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchEvents(applicationId);

    updateBreadcrumbs([
      { name: "Главная", path: "/" },
      { name: "Корзина", path: "/bag" },
    ]);
  }, [applicationId]);

  const deleteEvent = async (id: any) => {
    try {
      await api.delete(
        `/application/${
          applicationId ? applicationId : localStorage.getItem("applicationId")
        }/event/${id}`
      );
      fetchEvents(applicationId);
    } catch (error: any) {
      handleShowError(error.response.data.message);
    }
  };

  const deleteApplication = async () => {
    try {
      await api.delete(`/application/${applicationId}`);
      dispatch(setApplicationId("0"));
      localStorage.setItem("applicationId", "0");
    } catch (error: any) {
      handleShowError(error.response.data.message);
    }
  };

  const formApplication = async () => {
    try {
      await api.put(`/application/${applicationId}/form`);
      dispatch(setApplicationId("0"));
      localStorage.setItem("applicationId", "0");
      handleShowSuccess("Заявка сформирована");
    } catch (error: any) {
      handleShowError(error.response.data.message);
    }
  };

  return (
    <div>
      <div>
        <div className="container mt-3">
          {applications.length > 0 ? (
            <h2 className="text-center mb-4">Корзина</h2>
          ) : (
            <></>
          )}
          {applications.length === 0 ? (
            <>
              <h2 className="text-center">Корзина пуста</h2>
              <div className="text-center empty-cart mt-4">
                <img
                  src={"/Frontend-RIP/photos/bag.png"}
                  alt="Empty Cart"
                  className="empty-cart-image"
                />
              </div>
            </>
          ) : (
            applications.map((event) => (
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
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteEvent(event.id)}
                      >
                        Удалить товар
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          {applications.length > 0 && (
            <div className="text-center mt-3">
              <button
                className="btn btn-danger mr-2"
                onClick={() => deleteApplication()}
              >
                Очистить
              </button>
              <button className="btn btn-success" onClick={formApplication}>
                Оформить заказ
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Bag;
