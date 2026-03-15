import React from "react";
import { ModalWindow } from "../../../components/UI/feedback/ModalWindow";
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";
import { DetailReservationBlock } from "./DetailReservationBlock";
import "../styles/detail_reservations_window.css";


export const DetailReservationsWindow = ({isOpen, closeFunc, reservations_list}) => {
    return (
        <ModalWindow isOpen={isOpen} closeFunc={closeFunc} className={'reservations-window'}>
            <h1>
                Ваши номера
                <span style={{fontSize: "25px"}}> (всего {reservations_list.length})</span>
            </h1>
            {reservations_list.map(
                reservation => (
                <DetailReservationBlock 
                    reservation={reservation}
                    key={reservation.id}
                />
            ))}
            <PickMeButton onClick={closeFunc}>Закрыть</PickMeButton>
        </ModalWindow>
    )
}