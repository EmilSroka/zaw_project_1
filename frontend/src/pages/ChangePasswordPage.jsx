import { useChangePassword } from '../hooks/useChangePassword';
import React from 'react';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Controller, useForm } from 'react-hook-form';
import './pages.css';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';

function ChangePasswordPage() {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const { changePassword } = useChangePassword();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const onSubmit = (data) => {
      changePassword(data).then(() => {
          showSuccess({summary: 'Zmieniono hasło'});
          navigate('/timeline');
      }).catch(() => {
          showError({summary: 'Błąd zmiany hasła', details: 'Wyloguj się i zaloguj ponownie!'});
      });
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-md shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Zmień hasło do konta administratora
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="password" className="sr-only">Hasło</label>
              <Controller
                  name="password"
                  control={control}
                  rules={{ required: 'Hasło jest wymagane' }}
                  render={({ field }) => (
                      <Password
                      {...field}
                      id="password"
                      placeholder="Hasło"
                      feedback={false}
                      toggleMask
                      className="p-inputtext-sm w-full"
                      />
                  )}
              />
              {errors.password && <p className="text-red-500 text-xs mt-2">Hasło jest wymagane</p>}
            </div>
            <div>
              <Button label="Zmień hasło" className="p-button-sm w-full" />
            </div>
          </form>
        </div>
      </div>
    );
}
export default ChangePasswordPage;
