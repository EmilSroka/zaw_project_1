import React from 'react';
import { EventForm } from '../components/EventForm';
import { useNavigate, useParams } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useToast } from '../hooks/useToast';
import { useEvents } from '../hooks/useEvents';

function EditEventPage() {
  const { fetchEvent, updateEvent } = useEvents();
  const { showError, showSuccess } = useToast();
  const [event, setEvent] = React.useState(null);
  const { eventId } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchEvent(eventId).then(setEvent, () => showError({summary: 'Błąd ładowania', details: 'Spróbuj odświeżyć stronę!'}));
  }, []);

  const handleUpdate = (data) => {
    updateEvent(data).then(() => {
      showSuccess({summary: 'Aktualizacja udana' })
      navigate(`/timeline/${eventId}`);
    }).catch(() => {
      showError({summary: 'Błąd aktualizacji', details: 'Sprawdź poprawność danych!'})
    })
  }


  if (event === null) {
    return (<div className="bg-gray-100 min-h-screen">
      <div className="w-32 mx-auto pt-16">
        <h1 className="text-2xl font-semibold mb-2 text-center">Ładowanie formularza</h1>
        <ProgressSpinner/>
      </div>
    </div>);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <EventForm title="Edycja zdarzenia" defaultEvent={event} onSubmit={handleUpdate} />
    </div>
  );
}

export default EditEventPage;
