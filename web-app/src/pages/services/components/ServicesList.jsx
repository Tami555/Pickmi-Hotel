import React, { use, useEffect, useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { current_user_services } from "../../../api/services";
import { ContentApiBlock } from "../../../components/layouts/ContentApiBlock";
import { ServiceBlock } from "./ServiceBlock";
import "../styles/services_list.css"
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";
import { DetailServicesWindow } from "./DetailServicesWindow";


export const ServicesList = () => {
    const [userServices, setUserServices] = useState([])
    const [get_user_services, loading, errorServer] = useFetch(
        async () => {
            const res = await current_user_services()
            setUserServices(res);
        }
    )
    useEffect(() => {get_user_services()}, [])

    const [isOpenDetailWindow, openDetailWindow] = useState(false)

    return (
        <div className="services-list-block">
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
                <DetailServicesWindow
                    isOpen={isOpenDetailWindow}
                    closeFunc={() => {openDetailWindow(false); get_user_services()}}
                    services_list={userServices}
                />
            </ContentApiBlock>
        </div>
    )
}
