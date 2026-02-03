import React from "react";
import '../styles/about_us_page.css';
import { view_hotel } from "../../../images";


export const AboutUsPage = () => {
    return (
        <div className="about-us-page-block">
            <div className="infa">
                <h2>О нас</h2>
                <p>Наш отель сделан для пикми фембойчиков и альтушек. Нормисов не принимаем</p>
            </div>
            <img src={view_hotel} className="img-hotel"/>
        </div>
    )
}