import React from "react";
import './styles/footer.css';


export const Footer = () => {
    return (
        <div className="footer-block">
            <h2 className="title">Your Pickmi Hotel</h2>
            <div className="main-infa-block">
                <p className="item">Отель на ул.Пушкина 87</p>
                <a className="item" href="tel:+79546837356">Контакты: +79546837356</a>
                <a className="item" href="https://vk.com" target="_blank">Вконтанте: @PicmiH</a>
            </div>
            <p className="open-data">с 1867 до н.э-2026</p>
        </div>
    )
}