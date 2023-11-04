import { useEffect, useState } from 'react';

function useEnv(variableName) {
    const [value, setValue] = useState('');

    useEffect(() => {
        const envValue = process.env[`REACT_APP_${variableName}`];
        if (envValue) {
            setValue(envValue);
        } else {
            console.warn(`Environment variable "REACT_APP_${variableName}" is not set`);
            setTimeout(() => {
                const envValue = process.env[`REACT_APP_${variableName}`];
                if (envValue) {
                    setValue(envValue);
                }
            }, 1)
        }
    }, [variableName]);

    console.log('value: ', value);

    return value;
}

export default useEnv;