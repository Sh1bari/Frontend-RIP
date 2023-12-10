import React from 'react';
import Event from '../models/Event';

interface EventCardProps{
    event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    return (
        <div className="col-md-4">
        <a href={`#/event/${event.id}`}>
          <div className="card mb-3 pb-0" style={{ border: '1px solid #87ceeb', borderRadius: '8px', padding: '15px', marginBottom: '20px', backgroundColor: '#ffffff' }}>
            <img src={event.imageFilePath == "/gif/loading-11.gif" ? "/Frontend-RIP/gif/loading-11.gif"
             : (event.imageFilePath ? `http://192.168.0.13:9000/rip/${event.imageFilePath}` : '/Frontend-RIP/photos/error-404.png')}
              className="card-img-top img-fluid" alt="Картинка мероприятия" style={{ height: '200px', objectFit: 'cover' }} />
            <div className="card-body">
              <div className="row" style={{ color: '#333333', height: '65px', overflow: 'hidden' }}>
                <div className="col-md-7">
                  <h5 className="card-title" style={{ color: '#1d5a7c' }}>{event.name.length > 20 ? event.name.substring(0,20) + "..." : event.name}</h5>
                </div>
                <div className="col-md-5">
                  <p className="card-text" style={{ color: '#555555', marginTop: '2px', marginLeft: '1px' }}>{event.date}</p>
                </div>
              </div>
              <p className="card-text" style={{ color: '#333333', height: '70px', overflow: 'hidden' }}>{event.description.length > 80 ? event.description.substring(0, 80) + '...' : event.description}</p>
              <p className="card-left" style={{ marginTop: '30px' }}>
                <span style={{ fontWeight: 'bold', color: '#006400' }}>Осталось мест: <span>{event.tickets - event.purchasedTickets}</span></span>
              </p>
            </div>
          </div>
        </a>
      </div>
    );
  };
  
  export default EventCard;