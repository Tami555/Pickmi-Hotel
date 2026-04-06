import React from "react";
import "../styles/service_by_category_block.css";
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";


export const ServiceByCategoryBlock = ({service}) => {
    return (
        <div className="service-by-category-block">
            <div className="service-infa-block">
                <h2 className="title">{service.title}</h2>
                <p className="description">{service.description}</p>
                <div className="price-block">
                    <h3 className="service-price">{service.price ? `${service.price} руб` : 'бесплатно'}</h3>
                    <PickMeButton>Заказать</PickMeButton>
                </div>
            </div>
            <img className="image" src="https://www.good-cook.ru/articles/2025/10/30-1-organizatsija-generalnoj-uborki-kvartiry.jpg"/>
        </div>
    )
}