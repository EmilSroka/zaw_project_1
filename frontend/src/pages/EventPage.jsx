import React from 'react';
import { useEvents } from '../hooks/useEvents';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { useToast } from '../hooks/useToast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import CategoyTag from '../components/CategoryTag';
import { displayDate } from '../utils';
import { useUser } from '../hooks/useUser';

function EventPage() {
  const { user: { isLoggedIn }} = useUser(); 
  const [event, setEvent] = React.useState(null);
  const navigate = useNavigate();
  const { fetchEvent, deleteEvent, isReady } = useEvents();
  const { showError, showSuccess } = useToast();
  const { eventId } = useParams();

  const deleteEntry = () => {
    deleteEvent(eventId)
        .then(() => { 
          showSuccess({summary: 'Usunięto zdarzenie'});
          navigate('/timeline');
        })
        .catch(() => showError({summary: 'Błąd usuwania', details: 'Spróbuj ponownie za chwilę!'}));
} 

  React.useEffect(() => {
    if (isReady) {
      fetchEvent(eventId).then(setEvent, () => showError({summary: 'Błąd ładowania', details: 'Spróbuj odświeżyć stronę!'}));
    }
  }, [isReady]);


  if (event === null) {
    return (<div className="bg-gray-100 min-h-screen">
      <div className="w-32 mx-auto pt-16">
        <h1 className="text-2xl font-semibold mb-2 text-center">Podgląd wydarzenia</h1>
        <ProgressSpinner/>
      </div>
    </div>);
  }

  const header = event.image_url ?  <img alt="Card" src={event.image_url} /> : <></>;
  
  return (
    <div className="min-h-screen items-center justify-center bg-gray-100 p-8">
      <Card header={header} className="mx-auto p-4 max-w-lg bg-white">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold mb-2">{event.name}</h1>
          <p className="text-gray-600">
            {displayDate(event.start_date)}{event.end_date && smallerDate(event.start_date, event.end_date) === 'LEFT' && ` – ${displayDate(event.end_date)}`}
          </p>
        </div>
        {event.description && <p className="mb-4">{event.description}</p>}
        <div className="flex justify-between">
          {event.category?.name && event.category?.color_hash && <CategoyTag category={event.category} />}
          {isLoggedIn && <Button className="border-purple-700 border-2 p-1 mr-2" label="Edytuj" icon="pi pi-pencil" onClick={() => navigate(`/timeline/${event.event_id}/edit`)} />}
          {isLoggedIn && <Button className="border-red-700 border-2 p-1" label="Usuń" icon="pi pi-eraser" onClick={deleteEntry} /> }
        </div>
      </Card>
    </div>
  );
}

function smallerDate(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  if (d1 < d2) {
    return 'LEFT';
  } else if (d1 > d2) {
    return 'RIGHT';
  } else {
    return 'EQUAL';
  }
}



export default EventPage;
