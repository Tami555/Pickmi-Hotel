import React, { useState } from "react";
import { ModalWindow } from "../../../components/UI/feedback/ModalWindow";
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";
import { useAvatar } from "../../../hooks/useAvatar";
import "../styles/avatar_window.css";
import { AVATARS } from "../utils/avatars_data";


export const AvatarsWindow = ({isOpen, closeFunc}) => {
    const {putAvatar, getAvatar} = useAvatar();
    const [avatar, setAvatar] = useState({key: null, avatar: getAvatar()});

    return (
        <ModalWindow isOpen={isOpen} closeFunc={closeFunc} className={'avatar-window'}>
            <h1>Ваша аватарка</h1>
            <img src={avatar.avatar} className="main-avatar"/>
            <div className="avatars-block">
                {Object.entries(AVATARS).map(([key, ava_img]) => ( 
                    <img
                        key={key}
                        src={ava_img}
                        onClick={() => setAvatar({key: key, avatar: ava_img})}
                        className="ponit-img"
                    />
                ))}
            </div>
            <PickMeButton onClick={() => {avatar.key && putAvatar(avatar.key); closeFunc()}}>
                Применить
            </PickMeButton>
        </ModalWindow>
    )
}