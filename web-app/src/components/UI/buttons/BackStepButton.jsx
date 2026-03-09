import react from "react";
import { useNavigate } from "react-router-dom";
import { PickMeButton } from "./PickMeButton"
import { LeftArrowIcon } from "../../icons";
import "../styles/buttons/back_step_button.css"


export const BackStepButton = ({className, path=-1}) => {
    const nav = useNavigate()
    return (
        <PickMeButton onClick={() => nav(path)} title={'Назад'} className={`back_step_btn ${className || ''}`}>
            <LeftArrowIcon size={30}/>
        </PickMeButton>
    )
}