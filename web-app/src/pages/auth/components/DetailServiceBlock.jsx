import react from "react";
import { formatDateToRussian } from "../../../utils/formats/dates";
import "../styles/detail_service_block.css";
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";


export const DetailServiceBlock = ({service}) => {
    const service_status = {
        "pending" : "ожидает",
        "in_progress" : "в процессе",
        "canceled" : "отменено",
        "completed" : "завершено",
    }
    return (
        <div className="detail-service-block">
            <div className="service-status">{service_status[service.status]}</div>
            <img src="https://thumbs.dreamstime.com/b/женщина-в-перчатках-с-моющей-тряпкой-и-моющим-распылителем-266689672.jpg" className="service-img"/>
            <div className="service-infa-block">
                <h1 className="title">{service.service.title}</h1>
                <h2 className="point">
                    <span style={{color: "var(--purple-deep)"}}>Запланировано:</span>
                     {formatDateToRussian(service.scheduled_time)}
                </h2>
                <h2 className="point">
                    <span style={{color: "var(--purple-deep)"}}>Цена:</span>
                     {service.service.price > 0 ? `${service.service.price} руб` : 'Бесплатно'}
                </h2>
                <h2 className="point">
                    <span style={{color: "var(--purple-deep)"}}>Комментарий:</span>
                     {service.comment}
                </h2>
                {   
                    service.status == "pending" 
                    && 
                    <PickMeButton className={'cancel-btn'}>Отменить</PickMeButton>
                }
            </div>
        </div>
    )
}