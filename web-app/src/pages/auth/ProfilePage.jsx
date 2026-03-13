import react, { useEffect, useState } from "react";
import { CommonBlock } from "../../components/layouts/CommonBlock";
import { ContentApiBlock } from "../../components/layouts/ContentApiBlock";
import { useFetch } from "../../hooks/useFetch";
import { logout, read_profile } from "../../api/services";
import { PickMeButton } from "../../components/UI/buttons/PickMeButton";
import "./styles/profile.css"
import { FixedInput } from "../../components/UI/inputs/FixedInput";
import { ServicesList } from "../services/components/ServicesList";
import { EditProfileWindow } from "./components/EditProfileWindow";
import { useAvatar } from "../../hooks/useAvatar";
import { AvatarsWindow } from "./components/AvatarsWindow";
import { useAuth } from "../../contexts/AuthContext";


export const ProfilePage = () => {
    const { deleteUserData } = useAuth()
    const { getAvatar } = useAvatar();
    const [userProfile, setUserProfile] = useState({})
    const [isOpenEditWindow, openEditWindow] = useState(false)
    const [isOpenAvatarWindow, openAvatarWindow] = useState(false)

    const [get_profile, loading, errorServer] = useFetch(
        async () => {
            const res = await read_profile();
            setUserProfile(res);
        }
    )
    const logout_func = () => {
        logout();
        deleteUserData();
        window.location.href = '/'
    }

    useEffect(() => {get_profile()}, [])
    return (
        <CommonBlock>
            <ContentApiBlock loading={loading} error={errorServer}>
               <div className="profile-block">
                    <div className="column-block">
                        <img src={getAvatar()} className="avatar"/>
                        <PickMeButton
                            className={"change_avatar_btn"}
                            onClick={() => openAvatarWindow(true)}>
                            Сменить аватар
                        </PickMeButton>

                        <ServicesList/>
                    </div>
                    <div className="column-block">
                        <div className="block-user-infa">
                            <FixedInput label={"Имя"} value={userProfile.first_name}/>
                            <FixedInput label={"Фамилия"} value={userProfile.last_name}/>
                            {userProfile.patronymic && <FixedInput label={"Отчество"} value={userProfile.patronymic}/> }
                            <FixedInput label={"Почта"} value={userProfile.email}/>
                            <FixedInput label={"Телефон"} value={userProfile.phone}/>
                            <FixedInput label={"Серия Паспорта"} value={userProfile.passport_series}/>
                            <FixedInput label={"Номер Паспорта"} value={userProfile.passport_number}/>
                        </div>
                        <div className="btn-control-block">
                            <PickMeButton
                                className={"edit_btn"}
                                onClick={() => openEditWindow(true)}
                            >
                                Редактировать
                            </PickMeButton>
                            <PickMeButton onClick={logout_func}>Выйти</PickMeButton>
                        </div>
                        <div>Брони ....</div>
                    </div>
               </div>
               <EditProfileWindow 
                    isOpen={isOpenEditWindow}
                    closeFunc={() => openEditWindow(false)}
                    user={userProfile}
                    setUser={setUserProfile}
               />
               <AvatarsWindow
                    isOpen={isOpenAvatarWindow}
                    closeFunc={() => openAvatarWindow(false)}
               />
            </ContentApiBlock>
        </CommonBlock>
    )
}