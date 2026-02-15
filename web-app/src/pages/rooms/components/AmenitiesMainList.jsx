import React from "react";
import "../styles/amenities_blocks.css";
import { AMENITIES_ICON } from "../utils/amenities-icons";


export const AmenitiesMainList = ({amenities_list}) => {
    return (
        <div className="amenities-main-block">
            {amenities_list?.map((amenity) => (
                <div className="amenity-block">
                        {(() => {
                        const IconComponent = AMENITIES_ICON[amenity.title];
                        return IconComponent ? 
                            <IconComponent size={35} color={"var(--purple-deep)"} />
                            :
                            null;
                    })()}
                    <p>{amenity.title}</p>
                </div>
            ))}
        </div>
    )
}