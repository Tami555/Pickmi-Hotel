import React from "react";
import '../styles/other_detail_page.css';
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";
import { hotel_swimming_pool, hotel_bed_1, hotel_bed_2 } from "../../../images";
import { useNavigate } from "react-router-dom";

export const OtherDetailPage = () => {
    const nav = useNavigate()

    return (
        <div className="other-detail-page-block">
            <div className="btns-block">
               <PickMeButton
                    className={'btn'}
                    onClick={() => nav('/rooms')}
                >
                    забронировать
                </PickMeButton>
               <PickMeButton
                    className={'btn detail-btn'}
                    onClick={() => nav('/users/profile')}
                >
                    подробнее
                </PickMeButton>
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