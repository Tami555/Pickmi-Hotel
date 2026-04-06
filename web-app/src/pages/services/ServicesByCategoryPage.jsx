import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { services_by_category } from "../../api/services"
import { CommonBlock } from "../../components/layouts/CommonBlock"
import { ContentApiBlock } from "../../components/layouts/ContentApiBlock"
import { useFetch } from "../../hooks/useFetch"
import "./styles/services_by_category_page.css";
import { ServiceByCategoryBlock } from "./components/ServiceByCategoryBlock"


export const ServicesByCategoryPage = () => {
    const params = useParams()
    const [dataServices, setDataServices] = useState({})
    const [getServices, loading, errorServer] = useFetch(
        async () => {
            const res = await services_by_category(params.slug)
            setDataServices(res)
        }
    )
    useEffect(() => {getServices()}, [])

    return (
        <CommonBlock back_button={true}>
            <ContentApiBlock loading={loading} error={errorServer}>
                <h1 className="category-title">{dataServices?.title}</h1>
                {dataServices?.services?.map((service) => (
                    <ServiceByCategoryBlock service={service} key={service.id}/>
                ))}
            </ContentApiBlock>
        </CommonBlock>
    )
}