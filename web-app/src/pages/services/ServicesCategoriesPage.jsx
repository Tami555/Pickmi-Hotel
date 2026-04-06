import react, { useEffect, useState } from "react";
import { CommonBlock } from "../../components/layouts/CommonBlock";
import { ContentApiBlock } from "../../components/layouts/ContentApiBlock";
import { useFetch } from "../../hooks/useFetch";
import { services_categories } from "../../api/services";
import "./styles/services_categories_page.css";


export const ServicesCategoriesPage = () => {
    const [servicesCategories, setServicesCategories] = useState([])
    const [getServicesCategories, loading, errorServer] = useFetch(
        async () => {
          const res = await services_categories()
          setServicesCategories(res)
        }
      )
    useEffect(() => {getServicesCategories()}, [])

    // Функция для получения цвета по индексу
    const getCategoryColor = (index) => {
        const colors = ['var(--purple-deep)', 'var(--pink-rose)', 'var(--pink-soft)']
        return colors[index % 3]
    }

    return (
          <CommonBlock>
            <h1 className="service-category-title">Выберите услугу</h1>
    
            <ContentApiBlock loading={loading} error={errorServer}>
              {servicesCategories.map((cat, index) => (
                <div 
                    key={index}
                    className="service-category-block"
                    style={{ backgroundColor: getCategoryColor(index) }}
                >
                    {cat.title}
                </div>
              ))}
            </ContentApiBlock>
          </CommonBlock>
      );
}