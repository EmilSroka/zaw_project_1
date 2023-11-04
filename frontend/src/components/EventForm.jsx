import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Controller, useForm } from "react-hook-form";
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import React from "react";
import { useCategories } from "../hooks/useCategories";
import { Dropdown } from 'primereact/dropdown';

const EventForm = ({ defaultEvent, onSubmit: onSubmitData, title }) => {
    const { categories, fetchCategories } = useCategories();

    const { control, register, handleSubmit, setValue, setError, clearErrors, watch, formState: { errors } } = useForm({
      defaultValues: {
        name: defaultEvent?.name ?? null,
        description: defaultEvent?.description ?? null,
        start_date: defaultEvent?.start_date ? new Date(defaultEvent?.start_date) : null,
        end_date: defaultEvent?.end_date ? new Date(defaultEvent?.end_date) : null,
        event_id: defaultEvent?.event_id ?? null,
        category_id: defaultEvent?.category.category_id ?? null,
        image_url: defaultEvent?.image_url ?? null
      },
    });

    React.useEffect(() => {
        fetchCategories();
    }, []);

    const startDate = watch('start_date');
    const endDate = watch('end_date');
  
    React.useEffect(() => {
      if (startDate && endDate && endDate < startDate) {
        setError('end_date', {
          type: 'manual',
          message: 'Data końcowa musi być po dacie rozpoczęcia',
        });
      } else {
        clearErrors('end_date');
      }
    }, [startDate, endDate, setError, clearErrors]);  

    const onSubmit = (data) => {
        const finalData = { ...data };
        if (finalData.start_date) {
            finalData.start_date = formatDate(finalData.start_date);
        }
        if (finalData.end_date) {
            finalData.end_date = formatDate(finalData.end_date);
        }
        onSubmitData(finalData);
    };
  
    return (
        <Card className="mx-auto p-4 max-w-lg bg-white">
            <h1 className="text-2xl font-semibold mb-2">{title}</h1>
          <form onSubmit={handleSubmit(onSubmit)}>

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nazwa
              </label>
              <InputText id="name" {...register('name', { required: 'Nazwa jest wymagana' })} className="mt-1 block w-full" />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                Url obrazka
              </label>
              <InputText id="image_url" {...register('image_url', {
                pattern: {
                  value: /^(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})$/,
                  message: 'Niepoprawny URL',
                },
              })} className="mt-1 block w-full" />
              {errors.image_url && <p className="mt-1 text-sm text-red-600">{errors.image_url.message}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Opis
              </label>
              <InputTextarea id="description" {...register('description')} className="mt-1 block w-full" />
            </div>

            <div className="mb-4">
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                            Data rozpoczęcia
                        </label>
                        <Calendar
                            id="start_date"
                            {...register('start_date', { required: 'Data rozpoczęcia jest wymagana' })}
                            value={control._formValues.start_date}
                            onChange={(e) => setValue('start_date', e.value)}
                            showIcon
                            dateFormat="yy-mm-dd"
                            className="mt-1 block w-full"
                            />
                        {errors.start_date && <p className="mt-1 text-sm text-red-600 w-[160px]">{errors.start_date.message}</p>}
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                            Data zakończenia
                        </label>
                        <Calendar
                            id="end_date"
                            {...register('end_date')}
                            value={control._formValues.end_date}
                            onChange={(e) => setValue('end_date', e.value)}
                            showIcon
                            dateFormat="yy-mm-dd"
                            className="mt-1 block w-full"
                            />
                        {errors.end_date && <p className="mt-1 text-sm text-red-600 w-[160px]">{errors.end_date.message}</p>}
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Kategoria
                </label>
                <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                    <Dropdown
                    id="category"
                    {...field}
                    options={categories.map(x => ({ ...x, name: x.name.length < 35 ? x.name : `${x.name.slice(0,32)}...`}))}
                    optionLabel="name"
                    optionValue="category_id"
                    placeholder="Wybierz kategorię"
                    className="mt-1 block w-full"
                    />
                )}
                />
            </div>
            <Button type="submit" className="border-green-700 text-white bg-green-700 border-2 p-1 mr-2" label="Save" icon="pi pi-save" />
          </form>
        </Card>
    );
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

export { EventForm }