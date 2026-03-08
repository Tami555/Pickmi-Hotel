import React from "react";
import './styles/header.css';
import { logotype } from "../../images";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";


export const Header = () => {
    const { isAuth } = useAuth();
    const links = [
        { title: 'О нас', path: '/' },
        { title: 'Номера', path: '/rooms' },
        { title: 'Услуги', path: '/services' },
    ];
    const location = useLocation();
    const nav = useNavigate()
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
                <img src="https://avatars.mds.yandex.net/i?id=2e19c0cc5788dd99e73e223e37e77b32_l-9151930-images-thumbs&n=13" className="avatars-img"/> : 
                <button className="login-btn" onClick={() => nav("/users/login")}>+ </button>
            }
        </div>
    )
}