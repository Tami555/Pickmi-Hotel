import react from "react";
import { formatToRussianDateTime } from "../../../utils/formats/dates";
import "../styles/detail_service_block.css";
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";
import { SERVICES_STATUSES } from "../utils/data";


export const DetailServiceBlock = ({service}) => {
    const status = SERVICES_STATUSES[service.status]
    const serviceDetails = [
        { 
            label: "Запланировано: ", 
            value: formatToRussianDateTime(service.scheduled_time)
        },
        { 
            label: "Цена: ", 
            value: service.service.price > 0 ? `${service.service.price} руб` : 'Бесплатно'
        },
        { 
            label: "Комментарий: ", 
            value: service.comment
        },
        { 
            label: "Номер комнаты: ", 
            value: service?.reservation?.room?.room_number
        }
    ]
    return (
        <div className="detail-service-block">
            <div className="service-status" style={{background: status?.color}}>
                {status?.value}
            </div>
            <img src="https://thumbs.dreamstime.com/b/женщина-в-перчатках-с-моющей-тряпкой-и-моющим-распылителем-266689672.jpg" className="service-img"/>
            <div className="service-infa-block">
                <h1 className="title">{service.service.title}</h1>
                {serviceDetails.map((detail, index) => (
                    detail.value &&
                    <h2 key={index} className="point">
                        <span style={{color: "var(--purple-deep)"}}>
                            {detail.label}
                        </span>
                        {detail.value}
                    </h2>
                ))}
                {   
                    service.status == "pending" 
                    && 
                    <PickMeButton className={'cancel-btn'}>Отменить</PickMeButton>
                }
            </div>
        </div>
    )
}