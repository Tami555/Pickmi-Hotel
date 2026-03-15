import React from "react";
import './styles/header.css';
import { logotype } from "../../images";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useAvatar } from "../../hooks/useAvatar";


export const Header = () => {
    const { isAuth } = useAuth();
    const { getAvatar } = useAvatar();
    const links = [
        { title: 'О нас', path: '/' },
        { title: 'Номера', path: '/rooms' },
        { title: 'Услуги', path: '/services' },
    ];
    const location = useLocation();
    const nav = useNavigate();

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
            {
                isAuth ? 
                <img src={getAvatar()}
                    className="avatars-img"
                    onClick={() => nav('/users/profile')}
                /> : 
                <button className="login-btn" onClick={() => nav("/users/login")}>+ </button>
            }
        </div>
    )
}