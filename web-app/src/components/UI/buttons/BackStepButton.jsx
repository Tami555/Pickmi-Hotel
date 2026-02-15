import react from "react";
import { useNavigate } from "react-router-dom";
import { PickMeButton } from "./PickMeButton"
import { LeftArrowIcon } from "../../icons";
import "../styles/buttons/back_step_button.css"


export const BackStepButton = ({className}) => {
    const nav = useNavigate()
    return (
        <PickMeButton onClick={() => nav(-1)} title={'Назад'} className={`back_step_btn ${className || ''}`}>
            <LeftArrowIcon size={30}/>
        </PickMeButton>
    )
}