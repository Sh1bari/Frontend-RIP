import React, { ChangeEvent, useEffect, useState } from "react";
import { format } from "date-fns";
import ruLocale from "date-fns/locale/ru";
import api from "../API/api";
import Footer from "./global/Footer";
import { useBreadcrumbsUpdater } from "./breadcrumbs/BreadcrumbsContext";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import "react-datepicker/dist/react-datepicker.css";

interface HistoryProps {}
type Tab = "history" | "applications";

const models = [
  {
    id: 0,
    formationTime: "2023-12-25T02:35:08.702867",
    creatorUsername: "test",
    moderatorUsername: "test",
    endTime: "2023-12-25T02:35:08.702867",
    status: "FORMED",
  },
];

const History: React.FC<HistoryProps> = () => {
  const [sortField, setSortField] = useState<
    "formationTime" | "endTime" | "status"
  >("formationTime");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [applications, setApplications] = useState(models);
  const updateBreadcrumbs = useBreadcrumbsUpdater();

  const [formationTimeFrom, setFormationTimeFrom] = useState<Date | null>(null);
  const [formationTimeTo, setFormationTimeTo] = useState<Date | null>(null);
  const [creatorUsername, setUsername] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const fetchData = async () => {

    if(role == "ADMIN"){
      updateBreadcrumbs([
        { name: "Главная", path: "/" },
        {
          name: "Заявки",
          path: "/applications",
        },
      ]);
    }else {
      updateBreadcrumbs([
        { name: "Главная", path: "/" },
        {
          name: "История",
          path: "/applications",
        },
      ]);
    }
    
    try {
      const response = await api.get("/applications", {
        params: {
          dateFrom: formationTimeFrom || undefined,
          dateTo: formationTimeTo || undefined,
          status: selectedStatus || undefined,
        },
      });
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 3000);
  
    return () => {
      // Очистка интервала при размонтировании компонента
      clearInterval(intervalId);
    };
  }, [formationTimeFrom, formationTimeTo, selectedStatus]);

  // Функция для форматирования даты
  const formatDate = (date: string) => {
    return format(new Date(date), "HH:mm d MMMM yyyy", { locale: ruLocale });
  };

  // Функция для сортировки моделей
  const sortedModels = applications.slice().sort((a, b) => {
    const aValue = sortField === "endTime" ? a.endTime || "" : a[sortField];
    const bValue = sortField === "endTime" ? b.endTime || "" : b[sortField];

    if (sortOrder === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FORMED":
        return { color: "black", text: "Сформирована" };
      case "COMPLETED":
        return { color: "green", text: "Одобрена" };
      case "REJECTED":
        return { color: "red", text: "Отклонена" };
      default:
        return { color: "black", text: status };
    }
  };

  // Функция для обработки нажатия кнопки "Подробнее"

  const [selectedTab, setSelectedTab] = useState("applications"); // Изначально выбран "История"

  const role = useSelector((state: RootState) => state.auth.role);
  const username = useSelector((state: RootState) => state.auth.username);

  const handleRejectApplication = async (eventId: number) => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите отклонить заявку?"
    );

    if (confirmDelete) {
      try {
        await api.put(`/application/${eventId}/vote`, { status: "REJECTED" });
        fetchData();
      } catch (error) {
        console.error("Ошибка при отправке запроса:", error);
      }
    }
  };

  const handleApproveApplication = async (eventId: number) => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите одобрить заявку?"
    );

    if (confirmDelete) {
      try {
        await api.put(`/application/${eventId}/vote`, { status: "COMPLETED" });
        fetchData();
      } catch (error) {
        console.error("Ошибка при отправке запроса:", error);
      }
    }
  };


  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };

  return (
    <div>
      <div className="container mt-4">
        <div className="card p-3">
          {role == "ADMIN" ? (
            <>
              
            </>
          ) : (
            <></>
          )}
          {selectedTab == "history" ? (
            <>
              <h2 className="text-center mb-4">История</h2>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>
                        <button
                          className="btn btn-link"
                          onClick={() => {
                            setSortField("formationTime");
                            toggleSortOrder();
                          }}
                        >
                          Дата формирования{" "}
                          {sortField === "formationTime" &&
                            (sortOrder === "asc" ? "▲" : "▼")}
                        </button>
                      </th>
                      <th className="text-start" style={{ paddingLeft: "0px" }}>
                        Пользователь
                      </th>
                      <th>
                        <button
                          className="btn btn-link"
                          onClick={() => {
                            setSortField("endTime");
                            toggleSortOrder();
                          }}
                        >
                          Дата решения{" "}
                          {sortField === "endTime" &&
                            (sortOrder === "asc" ? "▲" : "▼")}
                        </button>
                      </th>
                      <th className="text-start" style={{ paddingLeft: "0px" }}>
                        Модератор
                      </th>
                      <th>
                        <button
                          className="btn btn-link"
                          onClick={() => {
                            setSortField("status");
                            toggleSortOrder();
                          }}
                        >
                          Статус{" "}
                          {sortField === "status" &&
                            (sortOrder === "asc" ? "▲" : "▼")}
                        </button>
                      </th>
                      <th
                        className="text-start"
                        style={{ paddingLeft: "45px" }}
                      >
                        Подробнее
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedModels.map(
                      (model, index) =>
                        model.creatorUsername == username && (
                          <tr key={index}>
                            <td>{formatDate(model.formationTime)}</td>
                            <td>{model.creatorUsername}</td>
                            <td>
                              {model.endTime
                                ? formatDate(model.endTime)
                                : "N/A"}
                            </td>
                            <td>{model.moderatorUsername}</td>
                            <td
                              style={{
                                color: getStatusColor(model.status).color,
                              }}
                            >
                              {getStatusColor(model.status).text}
                            </td>
                            <td>
                              <a
                                className="nav-link btn btn-primary mr-5"
                                style={{ backgroundColor: '#0000CD', borderColor: '#1a5276' }}
                                href={`#/application/${model.id}`}
                                role="button"
                              >
                                Подробнее
                              </a>
                            </td>
                          </tr>
                        )
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-center mb-4">Заявки</h2>

              <div className="col-13 card">
                <div className="card-body">
                  <h5 className="card-title">Фильтр</h5>
                  <form>
                    <div className="form-group">
                      <label>Имя пользователя:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={creatorUsername}
                        onChange={handleUsernameChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Статус:</label>
                      <select
                        className="form-control"
                        value={selectedStatus}
                        onChange={handleStatusChange}
                      >
                        <option value="">Выберите статус</option>
                        <option value="FORMED">FORMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>
                  </form>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-start" style={{ paddingLeft: "0px" }}>
                        ID
                      </th>
                      <th>
                        <button
                          className="btn btn-link"
                          onClick={() => {
                            setSortField("formationTime");
                            toggleSortOrder();
                          }}
                        >
                          Дата формирования{" "}
                          {sortField === "formationTime" &&
                            (sortOrder === "asc" ? "▲" : "▼")}
                        </button>
                      </th>
                      <th className="text-start" style={{ paddingLeft: "0px" }}>
                        Пользователь
                      </th>
                      <th>
                        <button
                          className="btn btn-link"
                          onClick={() => {
                            setSortField("endTime");
                            toggleSortOrder();
                          }}
                        >
                          Дата решения{" "}
                          {sortField === "endTime" &&
                            (sortOrder === "asc" ? "▲" : "▼")}
                        </button>
                      </th>
                      <th className="text-start" style={{ paddingLeft: "0px" }}>
                        Модератор
                      </th>
                      <th>
                        <button
                          className="btn btn-link"
                          onClick={() => {
                            setSortField("status");
                            toggleSortOrder();
                          }}
                        >
                          Статус{" "}
                          {sortField === "status" &&
                            (sortOrder === "asc" ? "▲" : "▼")}
                        </button>
                      </th>
                      <th
                        className="text-start"
                        style={{ paddingLeft: "25px" }}
                      >
                        Подробнее
                      </th>
                      <th
                        className="text-start"
                        style={{ paddingLeft: "10px" }}
                      >
                        Подтвердить
                      </th>
                      <th
                        className="text-start"
                        style={{ paddingLeft: "10px" }}
                      >
                        Отклонить
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedModels.map(
                      (model, index) =>
                        model.creatorUsername
                          .toLocaleLowerCase()
                          .includes(creatorUsername.toLocaleLowerCase()) && (
                          <tr key={index}>
                            <td>{model.id}</td>
                            <td>{formatDate(model.formationTime)}</td>
                            <td>{model.creatorUsername}</td>
                            <td>
                              {model.endTime
                                ? formatDate(model.endTime)
                                : "N/A"}
                            </td>
                            <td>{model.moderatorUsername}</td>
                            <td
                              style={{
                                color: getStatusColor(model.status).color,
                              }}
                            >
                              {getStatusColor(model.status).text}
                            </td>
                            <td>
                              <a
                                className="nav-link btn btn-primary mr-5"
                                style={{ backgroundColor: '#0000CD', borderColor: '#1a5276' }}
                                href={`#/application/${model.id}`}
                                role="button"
                                target="_blank"
                              >
                                Подробнее
                              </a>
                            </td>
                            <td>
                              {model.status == "FORMED" ? (
                                <>
                                  <button
                                    className="btn btn-success"
                                    onClick={() =>
                                      handleApproveApplication(model.id)
                                    }
                                  >
                                    Одобрить
                                  </button>
                                </>
                              ) : (
                                <></>
                              )}
                            </td>
                            <td>
                              {model.status == "FORMED" ? (
                                <>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                      handleRejectApplication(model.id)
                                    }
                                  >
                                    Отклонить
                                  </button>
                                </>
                              ) : (
                                <></>
                              )}
                            </td>
                          </tr>
                        )
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default History;
