import React from "react";
import { CommonBlock } from "../../components/layouts/CommonBlock";
import { WelcomePage } from "./components/WelcomePage";
import { AboutUsPage } from "./components/AboutUsPage";
import { OtherDetailPage } from "./components/OtherDetailPage";


export const MainPage = () => {
    return (
        <CommonBlock>
            <WelcomePage/>
            <AboutUsPage/>
            <OtherDetailPage/>
        </CommonBlock>
    )
}