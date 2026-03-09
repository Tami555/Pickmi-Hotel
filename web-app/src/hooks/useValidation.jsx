import { useState } from 'react';

export const useValidation = () => {
  const [error, setError] = useState('');

  const validate = (fields, validations) => {
    setError('');
    
    for (const [fieldName, value] of Object.entries(fields)) {
      if (validations[fieldName]) {
        const errorMsg = validations[fieldName](value);
        if (errorMsg) {
          setError(errorMsg);
          return false;
        }
      }
    }
    return true;
  };

  return { error, validate };
};