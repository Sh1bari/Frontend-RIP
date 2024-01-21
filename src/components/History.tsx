import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import ruLocale from "date-fns/locale/ru";
import api from "../API/api";
import Footer from "./global/Footer";
import { useBreadcrumbsUpdater } from "./breadcrumbs/BreadcrumbsContext";

interface HistoryProps {}

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

  useEffect(() => {
    updateBreadcrumbs([
      { name: "Главная", path: "/" },
      {
        name: "История",
        path: "/applications",
      },
    ]);

    const fetchData = async () => {
      try {
        const response = await api.get("/applications");
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchData();
  }, []);

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

  return (
    <div>
      <div className="container mt-4">
        <div className="card p-3">
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
                  <th className="text-start" style={{ paddingLeft: "0px" }}>Пользователь</th>
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
                  <th className="text-start" style={{ paddingLeft: "0px" }}>Модератор</th>
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
                  <th className="text-start" style={{ paddingLeft: "45px" }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {sortedModels.map((model, index) => (
                  <tr key={index}>
                    <td>{formatDate(model.formationTime)}</td>
                    <td>{model.creatorUsername}</td>
                    <td>{model.endTime ? formatDate(model.endTime) : "N/A"}</td>
                    <td>{model.moderatorUsername}</td>
                    <td style={{ color: getStatusColor(model.status).color }}>
                      {getStatusColor(model.status).text}
                    </td>
                    <td>
                      <a
                        className="nav-link btn btn-primary mr-5"
                        href={`#/application/${model.id}`}
                        role="button"
                      >
                        Подробнее
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default History;
