import React from "react";
import "../styles/service_by_category_block.css";
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";
import { useNavigate } from "react-router-dom";
import { formatImageUrl } from "../../../utils/formats/image";


export const ServiceByCategoryBlock = ({service}) => {
    const nav = useNavigate();
    return (
        <div className="service-by-category-block">
            <div className="service-infa-block">
                <h2 className="title">{service.title}</h2>
                <p className="description">{service.description}</p>
                <div className="price-block">
                    <h3 className="service-price">{service.price ? `${service.price} руб` : 'бесплатно'}</h3>
                    <PickMeButton onClick={() => nav(`/services/order/${service.slug}`)}>Заказать</PickMeButton>
                </div>
            </div>
            <img className="image" src={formatImageUrl(service.image)} alt={service.title}/>
        </div>
    )
}