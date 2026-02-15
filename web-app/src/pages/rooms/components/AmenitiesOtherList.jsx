import React from "react";
import "../styles/amenities_blocks.css";


export const AmenitiesOtherList = ({amenities_list}) => {
    return (
        <div className="amenities-other-block">
            <h2>Доступные вещи:</h2>
            {amenities_list.length ? 
                amenities_list.map((amenity) => (
                    <p>~ {amenity.title}</p>
                ))
                :
                <p>------</p>
            }
        </div>
    )
}