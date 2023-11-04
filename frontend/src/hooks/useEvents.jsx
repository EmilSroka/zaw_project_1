import React from "react";
import useEnv from "./useEnv";
import { useUser } from "./useUser";
import axios from "axios";

const EventsContext = React.createContext();

export const EventsProvider = ({ children }) => {
    const [events, setEvents] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const backendUrl = useEnv('BACKEND_URL');
    const { user: { apiKey } } = useUser();
    console.log('run', events, loading, backendUrl, apiKey);
    
    const config = {
        headers: {
            Authorization: apiKey
        }
    };

    const fetchEvents = async () => {
        console.log('start', events, loading, backendUrl, apiKey);
        setLoading(true);
        try {
           const response = await axios.get(`${backendUrl}/events`);
           setEvents(response.data);
        } catch (error) {
          console.error('Fetching events failed:', error.response ? error.response.data : error.message);
          throw error;
        } finally {
            setLoading(false);
        }
        console.log('end', events, loading, backendUrl, apiKey);
    };

    const fetchEvent = async (id) => {
        try {
           const response = await axios.get(`${backendUrl}/events/${id}`);
           return response.data;
        } catch (error) {
          console.error('Fetching event failed:', error.response ? error.response.data : error.message);
          throw error;
        }
    };

    const updateEvent = async (data) => {
        try {
            await axios.put(`${backendUrl}/events/${data.event_id}`, data, config);
            fetchEvents();
        } catch (error) {
            console.error('Updating event failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    const deleteEvent = async (id) => {
        try {
            await axios.delete(`${backendUrl}/events/${id}`, config);
            fetchEvents();
        } catch (error) {
            console.error('Delete event failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    const addEvent = async (data) => {
        try {
            const response = await axios.post(`${backendUrl}/events`, data, config);
            fetchEvents();
            return response.data.id;
        } catch (error) {
            console.error('Adding event failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    return (
        <EventsContext.Provider value={{ events, loading, fetchEvents, fetchEvent, updateEvent, deleteEvent, addEvent, isReady: backendUrl !== '' }}>
            {children}
        </EventsContext.Provider>
    );
};

export const useEvents = () => React.useContext(EventsContext);
