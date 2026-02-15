import React from "react";
import './styles/common_block.css';
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BackStepButton } from "../UI/buttons/BackStepButton";


export const CommonBlock = ({children, back_button=false}) => {
    return (
        <div className="common-content-block">
            <Header/>
                {back_button && <BackStepButton/>}
                {children}
            <Footer/>
        </div>
    )
}