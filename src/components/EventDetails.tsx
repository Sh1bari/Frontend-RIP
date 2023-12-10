import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Footer from './global/Footer';
import Event from '../models/Event';
import { useBreadcrumbsUpdater } from './breadcrumbs/BreadcrumbsContext';
import Mock from './mock/Mock';


interface EventDetailsProps {
}

const EventDetails: React.FC<EventDetailsProps> = () => {
  const { id } = useParams<{ id: string }>();
  const updateBreadcrumbs = useBreadcrumbsUpdater();


  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    // Проверьте, что здесь правильные хлебные крошки
  updateBreadcrumbs([{ name: 'Главная', path: '/' }, { name: selectedEvent? selectedEvent.name : "Мероприятие", path: '/event/' + id}]);
  }, [selectedEvent]);

  useEffect(() => {
    setSelectedEvent(Mock.find((event) => event.id === 1) || null);
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8082/api/event/${id}`);
        const data = await response.json();
        setSelectedEvent(data);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setTimeout(() => {
          fetchEventDetails();
      }, 2000);
      }
    };

    fetchEventDetails();
  }, [id]);

  return (
    <div>
      <div className="container mt-4" >
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card" style={{ border: '1px solid #87ceeb', borderRadius: '8px', padding: '15px', marginBottom: '20px', backgroundColor: '#ffffff' }}>
              <img 
                src={
                  selectedEvent?.imageFilePath
                  ? (selectedEvent.imageFilePath == "/gif/loading-11.gif" ? "/gif/loading-11.gif" 
                  : `http://192.168.0.13:9000/rip/${selectedEvent.imageFilePath}`)
                  : '/photos/error-404.png'
                } className="card-img-top img-fluid" alt="Holiday Image" style={{ height: '400px', objectFit: 'cover' }} />
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h2 className="card-title" style={{ color: '#1d5a7c' }}>
                      {selectedEvent? selectedEvent.name: "Загрузка..."}
                    </h2>
                  </div>
                  <div className="col-md-6 text-right">
                    <p className="card-text" style={{ color: '#555555', marginTop: '10px' }}>
                      {selectedEvent? selectedEvent.date : "Загрузка..."}
                    </p>
                  </div>
                </div>
                <div className="card-text">
                  <p className="card-text-left">Количество билетов: {selectedEvent? selectedEvent.tickets : "Загрузка..."}</p>
                </div>

                <p className="card-text" style={{ color: '#333333' }}>
                  {selectedEvent? selectedEvent.description : "Загрузка..."}
                </p>
                {/* Добавьте дополнительные поля мероприятия, если необходимо */}
                <div className="row mt-3">
                  <div className="col-md-6 text-left">
                    <button className="btn btn-success btn-block">Купить билет</button>
                  </div>
                  <div className="col-md-6">
                    <p className="card-left" style={{ marginTop: '6px' }}>
                      <span style={{ fontWeight: 'bold', color: '#006400' }}>
                        Осталось мест: {(selectedEvent?.tickets !== undefined && selectedEvent?.purchasedTickets !== undefined) ? selectedEvent.tickets - selectedEvent.purchasedTickets : 0}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default EventDetails;
