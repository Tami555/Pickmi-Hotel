import React from "react";
import '../styles/other_detail_page.css';
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";
import { hotel_swimming_pool, hotel_bed_1, hotel_bed_2 } from "../../../images";

export const OtherDetailPage = () => {
    return (
        <div className="other-detail-page-block">
            <div className="btns-block">
               <PickMeButton className={'btn'}>забронировать</PickMeButton>
               <PickMeButton className={'btn detail-btn'}>подробнее</PickMeButton>
            </div>

            <div className="images-gallery">
                <img className="main-img" src={hotel_swimming_pool}/>
                <div className="second-layer">
                    <img src={hotel_bed_1}/>
                    <img src={hotel_bed_2}/>
                </div>
            </div>

        </div>
    )
}