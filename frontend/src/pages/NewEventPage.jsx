import React from 'react';
import { EventForm } from '../components/EventForm';
import { useNavigate, useParams } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useToast } from '../hooks/useToast';
import { useEvents } from '../hooks/useEvents';

function NewEventPage() {
  const { addEvent } = useEvents();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();

  const handleUpdate = (data) => {
    addEvent(data).then((id) => {
      showSuccess({summary: 'Dodano wydarzenie' })
      navigate(`/timeline/${id}`);
    }).catch(() => {
      showError({summary: 'Błąd dodawania!', details: 'Sprawdź poprawność danych!'})
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <EventForm title="Nowe zdarzenie" onSubmit={handleUpdate} />
    </div>
  );
}

export default NewEventPage;
