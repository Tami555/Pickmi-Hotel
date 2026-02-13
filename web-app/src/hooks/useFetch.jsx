import React, { useState } from "react";

export const useFetch = (callback) => {
    // крутилк ожидания
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const fetching = async (...args) =>{
        try{
            setLoading(true)
            setError("");
            await callback(...args)
        }
        catch (e) {
            setError(e.message);
        }
        finally{
            setLoading(false)
        }
    }
    
    // возвращаем функцию, состояние загрузки, error
    return [fetching, loading, error];
}