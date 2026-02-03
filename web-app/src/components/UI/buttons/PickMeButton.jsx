import React from "react";
import '../styles/buttons/pickme_button.css';


export const PickMeButton = ({children, className, ...props}) => {
    return (
        <div {...props} className={`pickme-btn ${className || ''}`}>
            {children}
        </div>
    )
}
