import React from "react";
import "../styles/service_block.css";
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";
import { formatToRussianDateTime } from "../../../utils/formats/dates";


export const ServiceBlock = ({service}) => {
    return (
        <div className="service-block">
            <h1 className="title">{service.service.title}</h1>
            <div className="row-block">
                <h3 className="price">{service.service.price > 0 ? `${service.service.price} руб` : 'Бесплатно'}</h3>
                {
                    service.status == "pending"
                    && 
                    <PickMeButton className={'cancel-service-btn'}>Отменить</PickMeButton>
                }
            </div>
            <h2 className="scheduled-time">Запланировано на: {formatToRussianDateTime(service.scheduled_time)} </h2>
        </div>
    )
}