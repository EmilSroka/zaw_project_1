import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Controller, useForm } from 'react-hook-form';
import { useLogin } from '../hooks/useLogin';
import './pages.css';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const { control, register, handleSubmit, formState: { errors, data } } = useForm();
    const { login } = useLogin();
    const { showSuccess, showError } = useToast();
    const navigate = useNavigate();
  
    const onSubmit = (data) => {
        login(data).then(() => {
            showSuccess({summary: 'Zalogowano'});
            navigate('/timeline');
        }).catch(() => {
            showError({summary: 'Błąd logowania', details: 'Sprawdź login i hasło!'});
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-md shadow-md">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Zaloguj się do konta administratora
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="username" className="sr-only">Login</label>
                <InputText 
                  {...register('username', { required: true })} 
                  placeholder="Login" 
                  className="p-inputtext-sm w-full"
                />
                {errors.username && <p className="text-red-500 text-xs mt-2">Login jest wymagany</p>}
              </div>
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
                <Button label="Zaloguj" className="p-button-sm w-full" />
              </div>
            </form>
          </div>
        </div>
      );
}


export default LoginPage;
