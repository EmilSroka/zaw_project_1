import React from 'react';
import { ColorPicker } from 'primereact/colorpicker';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import TagsPage from './pages/TagsPage';
import TimelinePage from './pages/TimelinePage';
import EventPage from './pages/EventPage';
import EditEventPage from './pages/EditEventPage';
import Navbar from './layouts/Navbar';
import NewEventPage from './pages/NewEventPage';

function App() {
  const isLoggedIn = true;

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/timeline" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/tags" element={isLoggedIn ? <TagsPage /> : <Navigate to="/login" />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/timeline/add" element={<NewEventPage />} />
        <Route path="/timeline/:eventId" element={<EventPage />} />
        <Route path="/timeline/:eventId/edit" element={isLoggedIn ? <EditEventPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}


// function App() {
//   const [color, setColor] = React.useState();

//   return (
//     <div className="App p-10">
//       <h1 className="text-3xl font-bold underline">Hello, PrimeReact and Tailwind!</h1>
//       <ColorPicker value={color} onChange={(e) => setColor(e.value)} />
//     </div>
//   );
// }

export default App;
