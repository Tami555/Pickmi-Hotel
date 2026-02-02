import React from "react";
import './styles/header.css';
import { logotype } from "../../images";


export const Header = () => {
    const links = [
        { title: 'О нас', path: '/' },
        { title: 'Услуги', path: '/services' },
        { title: 'Номера', path: '/rooms' },
    ];
    return (
        <div className="header-block">
            <img src={logotype} className="logotype"/>

            {links.map((link) => 
            <a href={link.path} key={link.path} className={`head-link ${link.path == '/' ? 'active-link' : ''}`}>
                    {link.title}
            </a>
            )}
            
            <button className="login-btn">+ </button>
        </div>
    )
}