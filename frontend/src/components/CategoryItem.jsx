import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { ColorPicker } from 'primereact/colorpicker';
import { Button } from 'primereact/button';
import { useCategories } from '../hooks/useCategories';
import { useToast } from '../hooks/useToast';
import { InputText } from 'primereact/inputtext';
import { Controller, useForm } from 'react-hook-form';

const CategoryItem = ({ category, isNew=false }) => {
    const { control, register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            color_hash: category?.color_hash ?? 'FF0000',
            name: category?.name ?? ''
        }
    });
    const [ isEdit, setIsEdit ] = useState(false);
    const { deleteCategory, updateCategory, addCategory } = useCategories();
    const { showSuccess, showError } = useToast();

    const deleteEntry = () => {
        deleteCategory(category.category_id)
            .then(() => showSuccess({summary: 'Usunięto kategorię'}))
            .catch(() => showError({summary: 'Błąd usuwania', details: 'Sprawdź czy kategoria jest nieużywana!'}));
    } 

    const saveEntry = (data) => {
        updateCategory({ ...data, category_id: category.category_id })
            .then(() => showSuccess({summary: 'Zaktualizowano kategorię'}))
            .catch(() => showError({summary: 'Błąd aktualizacji'}));
    }

    const addEntry = (data) => {
        addCategory({ ...data })
            .then(() => showSuccess({summary: 'Zaktualizowano kategorię'}))
            .catch(() => showError({summary: 'Błąd aktualizacji'}));
    }

    if (isNew) {
        return <Card className="my-2 p-0 sm:w-[460px]">
            <form className="flex gap-3 items-center" onSubmit={handleSubmit(addEntry)}>
                <InputText 
                    {...register('name', { required: true })} 
                    placeholder="Nazwa" 
                    className={`p-inputtext-sm ${errors.name ? 'ring-2 ring-red-500' : ''}`} />
                <Controller
                    name="color_hash"
                    control={control}
                    render={({ field }) => <ColorPicker {...field} value={'FF0000'} />}
                    rules={{ required: true }} />
                <div className="ml-auto">
                    <Button type="submit" className="bg-green-700 text-white p-2 mr-2" icon="pi pi-check" label="Dodaj"/>
                </div>
            </form>
        </Card>
    }

    if (isEdit) {
        return <Card className="my-2 p-0 sm:w-[460px]">
            <form className="flex gap-3 items-center" onSubmit={handleSubmit(saveEntry)}>
                <InputText 
                    {...register('name', { required: true })} 
                    placeholder="Nazwa" 
                    className="p-inputtext-sm" />
                <Controller
                    name="color_hash"
                    control={control}
                    render={({ field }) => <ColorPicker {...field} />}
                    rules={{ required: true }} />
                <div className="ml-auto">
                    <Button type="submit" className="bg-green-700 border-green-700 text-white p-1 border-2 mr-2" icon="pi pi-check" label="Zapisz"/>
                    <Button className="border-zinc-800 border-2 p-1 box-border" icon="pi pi-times" label="Anuluj"  onClick={() => { setIsEdit(false); reset(); }} />
                </div>
            </form>
        </Card>
    }

    return (
        <Card className="my-2 p-0 sm:w-[460px]">
            <div className="flex gap-3 items-center">
                <h2 className="max-w-[200px] overflow-ellipsis overflow-hidden">{category.name}</h2>
                <ColorPicker value={category.color_hash} disabled />
                <div className="ml-auto">
                    <Button className="border-purple-700 border-2 p-1 mr-2" label="Edytuj" icon="pi pi-pencil" onClick={() => setIsEdit(true)} />
                    <Button className="border-red-700 border-2 p-1" label="Usuń" icon="pi pi-eraser" onClick={deleteEntry} />
                </div>
            </div>
        </Card>
    );
};

export default CategoryItem;