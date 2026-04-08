import react, { useState } from "react";
import { formatToRussianDateTime } from "../../../utils/formats/dates";
import "../styles/detail_service_block.css";
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";
import { SERVICES_STATUSES } from "../utils/data";
import { ModalWindow } from "../../../components/UI/feedback/ModalWindow";
import { Loader } from "../../../components/UI/feedback/Loader";
import { useFetch } from "../../../hooks/useFetch";
import { cancel_service } from "../../../api/services";
import { formatImageUrl } from "../../../utils/formats/image";


export const DetailServiceBlock = ({service}) => {
    const [status, setStatus] = useState(SERVICES_STATUSES[service.status])
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

    const [confirmCancelWindow, openConfirmCancelWindow] = useState(false)
    const [serviceCancel, loadingCancel, serverError] = useFetch(
        async () => {
            await cancel_service(service.id)
            openConfirmCancelWindow(false);
            setStatus(SERVICES_STATUSES.canceled)
        }
    )

    return (
        <div className="detail-service-block">
            <div className="service-status" style={{background: status?.color}}>
                {status?.value}
            </div>
            <img src={formatImageUrl(service.service.image)} alt={service.service.title} className="service-img"/>
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
                    status == SERVICES_STATUSES.pending
                    && 
                    <PickMeButton className={'cancel-btn'} onClick={() => openConfirmCancelWindow(true)}>Отменить</PickMeButton>
                }
                {serverError || <p className="errors">{serverError}</p>}
            </div>
            <ModalWindow
                isOpen={confirmCancelWindow}
                closeFunc={() => {openConfirmCancelWindow(false)}}
            >
                <h1>Вы уверены, что хотите отменить услугу "{service.service.title}" ?
                </h1>
                <PickMeButton
                    onClick={() => serviceCancel()}
                >
                    {loadingCancel ? <Loader/> : 'Отменить услугу'}
                </PickMeButton>
            </ModalWindow>
        </div>
    )
}