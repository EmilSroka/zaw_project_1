import React from 'react';
import { useEvents } from '../hooks/useEvents';
import { Timeline } from 'primereact/timeline';
import EventItem from '../components/EventItem';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useToast } from '../hooks/useToast';
import { useUser } from '../hooks/useUser';
import { useLocation } from 'react-router-dom';
import once from 'lodash/once';

function TimelinePage() {
  const { user: { isLoggedIn } } = useUser();
  const { events, fetchEvents, loading, isReady } = useEvents();
  const { showError } = useToast();
  const [isFetched, setIsFetched] = React.useState(false);

  console.log(process.env.REACT_APP_BACKEND_URL);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isPrintable = queryParams.get('print') ?? false;

  React.useEffect(() => {
    if (isReady) {
      fetchEvents()
        .then(() => setIsFetched(true))
        .catch(() => showError({summary: 'Błąd ładowania', details: 'Spróbuj odświeżyć stronę!'}));
    }
  }, [isReady]);

  const print = React.useMemo(() => once(() => window.print()), []);

  React.useEffect(() => {
    if (!loading && isPrintable && isReady && isFetched) {
      print();
    }
  }, [isPrintable, loading]);

  const sortedEvents = React.useMemo(() => {
    const eventsCopy = [...events];
    eventsCopy.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    if (isLoggedIn && !isPrintable) {
      eventsCopy.push({
        isAddNew: true,
      }) 
    }
    return eventsCopy;
  }, [events, isLoggedIn, isPrintable]);
    
  return (
      <div className="min-h-screen items-center justify-center bg-gray-100 p-8">
          <h1 className="text-center text-xl mb-4">Oś czasu</h1>
          {
            loading ? <div className="w-32 mx-auto"><ProgressSpinner/></div> : <Timeline value={sortedEvents} content={(item) => <EventItem event={item} />} />
          }
      </div>
  );
}

export default TimelinePage;
