import React from "react";
import './styles/common_block.css';
import { Header } from "./Header";
import { Footer } from "./Footer";


export const CommonBlock = ({children}) => {
    return (
        <div className="common-content-block">
            <Header/>
                {children}
            <Footer/>
        </div>
    )
}