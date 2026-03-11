import React, { use, useEffect, useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { current_user_services } from "../../../api/services";
import { ContentApiBlock } from "../../../components/layouts/ContentApiBlock";
import { ServiceBlock } from "./ServiceBlock";

export const ServicesList = () => {
    const [userServices, setUserServices] = useState([])
    const [get_user_services, loading, errorServer] = useFetch(
        async () => {
            const res = await current_user_services()
            setUserServices(res);
        }
    )
    useEffect(() => {get_user_services()}, [])
    return (
        <div>
            <h1>Ваши услуги</h1>
            <ContentApiBlock loading={loading} error={errorServer}>
                {userServices.map(service => (<ServiceBlock service={service} key={service.id}/>))}
            </ContentApiBlock>
        </div>
    )
}

// {
//     "id": 0,
//     "scheduled_time": "2026-03-10T20:42:47.454Z",
//     "comment": "string",
//     "service": {
//       "id": 0,
//       "slug": "string",
//       "title": "string",
//       "price": 0,
//       "description": "string",
//       "image": "string"
//     },
//     "status": "string"
//   }