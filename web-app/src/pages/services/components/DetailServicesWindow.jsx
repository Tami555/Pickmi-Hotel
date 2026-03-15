import React from "react";
import { ModalWindow } from "../../../components/UI/feedback/ModalWindow";
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";
import { DetailServiceBlock } from "./DetailServiceBlock";


export const DetailServicesWindow = ({
        isOpen,
        closeFunc,
        services_list,
        title_window="Все ваши услуги"
    }) => {
    return (
        <ModalWindow isOpen={isOpen} closeFunc={closeFunc}>
            <h1>
                {title_window}
                <span style={{fontSize: "25px"}}> (всего {services_list.length})</span>
            </h1>
            {services_list.map(
                service => (<DetailServiceBlock service={service} key={service.id}/>)
            )}
            <PickMeButton onClick={closeFunc}>Закрыть</PickMeButton>
        </ModalWindow>
    )
}