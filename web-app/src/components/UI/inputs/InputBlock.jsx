import React from "react";
import '../styles/inputs/input.css'


export const InputBlock = ({ 
  label, 
  name, 
  ...props 
}) => {
  return (
    <div className='block-input'>
      {label && <label htmlFor={name}>{label}</label>}
      <input 
        id={name}
        name={name}
        autoComplete="off" 
        required 
        {...props}
        />
    </div>
  );
}
