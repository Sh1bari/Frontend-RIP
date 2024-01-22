import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "./global/Footer";
import Event from "../models/Event";
import { useBreadcrumbsUpdater } from "./breadcrumbs/BreadcrumbsContext";
import Mock from "./mock/Mock";
import api from "../API/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  showErrorNotification,
  showSuccessNotification,
} from "./global/notificationService";
import { setApplicationId } from "../redux/authSlice";
import { parse, format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ruLocale from "date-fns/locale/ru";
import { ru } from "date-fns/locale";
import minioConfig from "../API/config";

interface EventDetailsProps {}

const EventDetails: React.FC<EventDetailsProps> = () => {
  const { id } = useParams<{ id: string }>();
  const updateBreadcrumbs = useBreadcrumbsUpdater();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const applicationId = useSelector(
    (state: RootState) => state.auth.applicationId
  );
  const role = useSelector((state: RootState) => state.auth.role);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [isEditing, setIsEditing] = useState(false); // Локальное состояние для режима редактирования
  const [editableFields, setEditableFields] = useState({
    name: selectedEvent ? selectedEvent.name : "",
    date: selectedEvent ? selectedEvent.date : "",
    tickets: selectedEvent ? selectedEvent.tickets : 0,
    description: selectedEvent ? selectedEvent.description : "",
  });

  const updateEvent = async () => {
    try {
      // Конвертировать строку в формат "2024-01-22T03:41:18.169Z" в объект Date
      console.log("Event updated successfully", editableFields.date);
      const parsedDate = parse(
        editableFields.date,
        "dd MMMM HH:mm yyyy",
        new Date(),
        {
          locale: ruLocale,
        }
      );
      const formattedDate = format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", {
        locale: ruLocale,
      });
      console.log("Formatted Date:", formattedDate);

      // Подготовить данные для отправки
      const updatedData = {
        ...editableFields,
        eventTime: formattedDate, // Заменить поле date на объект Date
      };

      console.log("Updated Data:", updatedData);

      const response = await api.put(`/event/${id}`, updatedData);
      setSelectedEvent(response.data);
    } catch (error: any) {
      if (error.response) {
        handleShowError(error.response.data.message);
      }
    }
  };

  const saveChanges = () => {
    updateEvent();
    setIsEditing(false); // После сохранения изменений переключаем режим редактирования обратно на false
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditableFields((prevFields) => ({
      ...prevFields,
      [name]:
        name === "date"
          ? format(
              parse(value as string, "dd MMMM HH:mm", new Date()),
              "dd MMMM HH:mm"
            )
          : value,
    }));
  };

  useEffect(() => {
    updateBreadcrumbs([
      { name: "Главная", path: "/" },
      {
        name: selectedEvent ? selectedEvent.name : "Мероприятие",
        path: "event/" + id,
      },
    ]);
  }, [selectedEvent]);
  const dispatch = useDispatch();

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/event/${id}`);
      setSelectedEvent(response.data);
      dispatch(setApplicationId(response.data.applicationId));
      localStorage.setItem("applicationId", response.data.applicationId);
      setEditableFields({
        name: response.data.name,
        date: response.data.date,
        tickets: response.data.tickets,
        description: response.data.description,
        // Добавьте другие поля, если они есть в вашей модели
      });
    } catch (error) {
      console.error("Error fetching event details:", error);
      setTimeout(() => {
        fetchEventDetails();
      }, 2000);
    }
  };

  useEffect(() => {
    setSelectedEvent(Mock.find((event) => event.id === 1) || null);
    fetchEventDetails();
  }, [id]);

  const handleShowError = (msg: string) => {
    showErrorNotification(msg);
  };

  const handleShowSuccess = (msg: string) => {
    showSuccessNotification(msg);
  };

  const buyTicket = async () => {
    try {
      // Отправляем POST-запрос с данными формы
      const response = await api.post(
        `/application/${applicationId}/event/${id}`
      );
      handleShowSuccess("Вы подали заявку на участие");
      dispatch(setApplicationId(response.data.id));
      localStorage.setItem("applicationId", response.data.id);
    } catch (error: any) {
      if (error.response) {
        handleShowError(error.response.data.message);
      }
    }
  };

  const showNotAuthError = () => {
    handleShowError("Для покупки билеты вы должны быть авторизированы");
  };

  const handleDateChange = (date: Date | null) => {
    const formattedDate = date
      ? format(date, "dd MMMM HH:mm yyyy", { locale: ruLocale })
      : "";

    setEditableFields((prevFields) => {
      // Добавляем проверку, чтобы избежать зацикливания
      if (prevFields.date !== formattedDate) {
        return {
          ...prevFields,
          date: formattedDate,
        };
      }
      return prevFields;
    });

    console.log(formattedDate); // Можете добавить ваши действия с отформатированной датой
  };

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleUploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append("file", imageFile || ""); // добавьте файл в FormData

      const response = await api.post(`/event/${id}/photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Картинка загружена успешно", response.data);
      fetchEventDetails();
      // Дополнительная логика при успешной загрузке
    } catch (error) {
      console.error("Ошибка при загрузке картинки", error);
      // Дополнительная логика при ошибке загрузки
    }
  };

  return (
    <div>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div
              className="card"
              style={{
                border: "1px solid #87ceeb",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "20px",
                backgroundColor: "#ffffff",
              }}
            >
              <img
                src={
                  selectedEvent?.imageFilePath
                    ? selectedEvent.imageFilePath == "/gif/loading-11.gif"
                      ? "/Frontend-RIP/gif/loading-11.gif"
                      : `${minioConfig.minioUrl}:9000/rip/${selectedEvent.imageFilePath}`
                    : "/Frontend-RIP/photos/error-404.png"
                }
                className="card-img-top img-fluid"
                alt="Holiday Image"
                style={{ height: "400px", objectFit: "cover" }}
              />
              {isEditing ? (
                <>
                  <div className="mt-3">
                    <div className="row">
                      <div className="col-md-6">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setImageFile(e.target.files?.[0] || null)
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <button
                          className="btn btn-success"
                          onClick={() => {
                            handleUploadImage();
                          }}
                        >
                          Загрузить картинку
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          className="form-control mb-2"
                          name="name"
                          value={editableFields.name}
                          onChange={handleChange}
                        />
                      </>
                    ) : (
                      <>
                        <h2 className="card-title" style={{ color: "#1d5a7c" }}>
                          {selectedEvent ? selectedEvent.name : "Загрузка..."}
                        </h2>
                      </>
                    )}
                  </div>
                  {isEditing ? (
                    <>
                      <div className="col-md-6 text-right">
                        <DatePicker
                          selected={
                            editableFields.date
                              ? parse(
                                  editableFields.date,
                                  "dd MMMM HH:mm yyyy",
                                  new Date(),
                                  { locale: ruLocale }
                                )
                              : null
                          }
                          onChange={handleDateChange}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          timeCaption="Время"
                          dateFormat="dd MMMM HH:mm yyyy"
                          locale={ru}
                          customInput={<input type="text" />}
                          value={editableFields.date}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-md-6 text-right">
                        <p
                          className="card-text"
                          style={{ color: "#555555", marginTop: "10px" }}
                        >
                          {selectedEvent ? selectedEvent.date : "Загрузка..."}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div
                  className="card-text"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <p className="card-text-left" style={{ marginRight: "10px" }}>
                    Количество билетов:
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="tickets"
                      value={editableFields.tickets}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>
                      {selectedEvent ? selectedEvent.tickets : "Загрузка..."}
                    </p>
                  )}
                </div>
                {isEditing ? (
                  <>
                    <textarea
                      className="form-control mb-2"
                      name="description"
                      value={editableFields.description}
                      onChange={handleChange}
                    />
                  </>
                ) : (
                  <>
                    <p className="card-text" style={{ color: "#333333" }}>
                      {selectedEvent
                        ? selectedEvent.description
                        : "Загрузка..."}
                    </p>
                  </>
                )}
                {/* Добавьте дополнительные поля мероприятия, если необходимо */}
                <div className="row mt-3">
                  <div className="col-md-6 text-left">
                    {isAuthenticated ? (
                      <>
                        {role == "ADMIN" ? (
                          <>
                            <button
                              className="btn btn-success btn-block"
                              onClick={buyTicket}
                            >
                              Купить билет
                            </button>
                            {isEditing ? (
                              <>
                                <button
                                  className="btn btn-primary btn-block mb-3"
                                  onClick={() => saveChanges()}
                                >
                                  Сохранить
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="btn btn-primary btn-block mb-3"
                                  onClick={() => {
                                    setIsEditing(true);
                                    fetchEventDetails();
                                  }}
                                >
                                  Редактировать
                                </button>
                              </>
                            )}
                          </>
                        ) : (
                          <button
                            className="btn btn-success btn-block"
                            onClick={buyTicket}
                          >
                            Купить билет
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-secondary btn-block"
                          onClick={showNotAuthError}
                        >
                          Купить билет
                        </button>
                      </>
                    )}
                  </div>
                  <div className="col-md-6">
                    <p className="card-left" style={{ marginTop: "6px" }}>
                      <span style={{ fontWeight: "bold", color: "#006400" }}>
                        Осталось мест:{" "}
                        {selectedEvent?.tickets !== undefined &&
                        selectedEvent?.purchasedTickets !== undefined
                          ? selectedEvent.tickets -
                            selectedEvent.purchasedTickets
                          : 0}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetails;
