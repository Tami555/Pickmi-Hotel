import React from "react";
import './styles/header.css';
import { logotype } from "../../images";
import { Link, useLocation } from "react-router-dom";


export const Header = () => {
    const links = [
        { title: 'О нас', path: '/' },
        { title: 'Услуги', path: '/services' },
        { title: 'Номера', path: '/rooms' },
    ];
    const location = useLocation();
    return (
        <div className="header-block">
            <img src={logotype} className="logotype"/>

            {links.map((link) => 
            <Link  
                to={link.path}
                key={link.path}
                className={`head-link ${link.path == location.pathname ? 'active-link' : ''}`}
            >
                {link.title}
            </Link>
            )}
            
            <button className="login-btn">+ </button>
        </div>
    )
}