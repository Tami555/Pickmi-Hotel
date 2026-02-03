import React from "react";
import '../styles/welcome_page.css';
import { pink_hotel } from "../../../images";


export const WelcomePage = () => {
    return (
        <div className="title-page-block">
            <img src={pink_hotel} className="img-hotel"/>
            <h1 className="title-hotel">Your Pickmi</h1>
        </div>
    )
}