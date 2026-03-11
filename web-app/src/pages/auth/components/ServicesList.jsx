import React, { use, useEffect, useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { current_user_services } from "../../../api/services";
import { ContentApiBlock } from "../../../components/layouts/ContentApiBlock";
import { ServiceBlock } from "./ServiceBlock";
import "../styles/services_list.css"
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";
import { ModalWindow } from "../../../components/UI/feedback/ModalWindow";
import { DetailServiceBlock } from "./DetailServiceBlock";


export const ServicesList = () => {
    const [userServices, setUserServices] = useState([])
    const [get_user_services, loading, errorServer] = useFetch(
        async () => {
            const res = await current_user_services()
            setUserServices(res);
        }
    )
    const [isOpenDetailWindow, openDetailWindow] = useState(false)

    useEffect(() => {get_user_services()}, [])
    return (
        <div className="services-lict-block">
            <h1 className="main-title">Ваши услуги</h1>
            <ContentApiBlock loading={loading} error={errorServer}>
                {
                    userServices.length > 0 ?
                    <>
                        {userServices.slice(0, 2).map(service => (<ServiceBlock service={service} key={service.id}/>))}
                        {userServices.length > 2 && <p>...</p>}
                        <PickMeButton onClick={() => openDetailWindow(true)}>Подробнее</PickMeButton>
                    </>
                    :
                    <div className={"create-service-btn"}>+</div>
                }
                <ModalWindow isOpen={isOpenDetailWindow} closeFunc={() => openDetailWindow(false)}>
                    <h1 className="detail-window-title">Ваши услуги <span style={{fontSize: "25px"}}>(всего {userServices.length})</span></h1>
                    {userServices.map(service => (<DetailServiceBlock service={service} key={service.id}/>))}
                    <PickMeButton onClick={() => openDetailWindow(false)}>Закрыть</PickMeButton>
                </ModalWindow>
            </ContentApiBlock>
        </div>
    )
}
