import React from "react";
import "../styles/inputs/fixed_input.css";


export const FixedInput = ({label, value, width=250}) => {
    return (
        <div className="infa-fixed-block">
            <h2>{label}</h2>
            <p className="infa-fixed-input" style={{width: `${width}px`}}>
                {value}
            </p>
        </div>
    )
}