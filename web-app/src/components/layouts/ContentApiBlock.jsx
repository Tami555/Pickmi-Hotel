import React from "react"
import { Loader } from '../UI/feedback/Loader';


export const ContentApiBlock = ({children, loading, error }) => {

    if (loading) {
        return <Loader/>
    }
    else {
        if (error) {
            return (
                <p className="errors"
                    style={{fontSize:'25px', color: 'var(--error)'}}
                >
                    {error}    
                </p>
            )
        }
        else {
            return children
        }
    }
}