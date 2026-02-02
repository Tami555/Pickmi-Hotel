import React from "react";
import './styles/footer.css';


export const Footer = () => {
    return (
        <div className="footer-block">
            <h2 className="title">Your Pickmi Hotel</h2>
            <div className="main-infa-block">
                <p>Отель на ул.Пушкина 87</p>
                <p>контакты: +79546837356</p>
                <p>Вконтанте: @PicmiH</p>
            </div>
            <p className="open-data">с 1867 до н.э-2026</p>
        </div>
    )
}