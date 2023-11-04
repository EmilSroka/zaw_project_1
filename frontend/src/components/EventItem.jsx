import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import CategoyTag from './CategoryTag';
import { displayDate } from '../utils';

const EventItem = ({ event}) => {
    const navigate = useNavigate();
    if (event.isAddNew) {
        return (
            <Card className="my-2 p-0 sm:w-[360px]">
                <div className="flex flex-col">
                    <h2 className="overflow-hidden overflow-ellipsis whitespace-nowrap text-lg pb-0">Dodaj nowe wydarzenie</h2>
                    <div className="flex justify-between pt-2">
                        <div></div>
                        <Button className="border-green-700 bg-green-700 text-white border-2 p-1 w-[150px]" label="Dodaj" icon="pi pi-plus-circle" onClick={() => navigate(`/timeline/add`)} />
                    </div>
                </div>
            </Card>
        );
    }
    return (
        <Card className="my-2 p-0 sm:w-[360px]">
            <div className="flex flex-col">
                <h2 className="overflow-hidden overflow-ellipsis whitespace-nowrap text-lg pb-0">{event.name}</h2>
                <div className="text-sm pt-1">{displayDate(event.start_date)}</div>
                {event.description && <div className="pt-2">{event?.description?.length < 400 ? event.description :`${event.description.slice(0,397)}...`}</div>}
                <div className="flex justify-between pt-2">
                    <div>
                        { event.category?.name && event.category?.color_hash && <CategoyTag category={event.category} />} 
                    </div>
                    <Button className="border-purple-700 border-2 p-1 w-[150px] hide-for-print" label="Czytaj więcej" icon="pi pi-info-circle" onClick={() => navigate(`/timeline/${event.event_id}`)} />
                </div>
                
            </div>
        </Card>
    );
};

export default EventItem;