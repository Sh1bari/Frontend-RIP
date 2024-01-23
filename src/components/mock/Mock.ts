import Event from "../../models/Event";

const Mock: Event[] = [
    {
        id: 1,
        name: "Концерт UglyStephan",
        description: "Примите участие в незабываемом событии с МГТУ им Баумана",
        date: "23 Февраля 2024",
        imageFileId: 1,
        imageFilePath: "/photos/2.jpg",
        tickets: 10,
        status: "ACTIVE",
        purchasedTickets: 0,
    },
    {
        id: 2,
        name: "Лучший профорг",
        description: "Выберите лучшего профорга МГТУ им Баумана",
        date: "25 Мая 2024",
        imageFileId: 2,
        imageFilePath: "/photos/3.jpg",
        tickets: 125,
        status: "ACTIVE",
        purchasedTickets: 0,
    },
    {
        id: 3,
        name: "Новый Год",
        description: "Соберись с профкомом МГТУ на празднование Нового Года",
        date: "1 Января 2024",
        imageFileId: 2,
        imageFilePath: "/photos/4.jpg",
        tickets: 30,
        status: "ACTIVE",
        purchasedTickets: 0,
    },
];
export default Mock;