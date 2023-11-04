import React, { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const toast = useRef(null);

  const showSuccess = ({ summary, details }) => {
    toast.current.show({ severity: 'info', summary: summary ?? 'Informacja', detail: details, life: 5000});
  };

  const showError = ({ summary, details }) => {
    toast.current.show({severity:'error', summary: summary ?? 'Błąd', detail: details, life: 5000});
  };

  return (
    <ToastContext.Provider value={{ showError, showSuccess }}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);