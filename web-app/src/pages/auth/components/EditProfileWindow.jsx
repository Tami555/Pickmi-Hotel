import react, { useState } from "react";
import { ModalWindow } from "../../../components/UI/feedback/ModalWindow";
import {InputBlock} from "../../../components/UI/inputs/InputBlock";
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";
import { useFetch } from "../../../hooks/useFetch";
import { edit_profile } from "../../../api/services";
import { Loader } from "../../../components/UI/feedback/Loader";
import { useValidation } from "../../../hooks/useValidation";
import { editProfileSchema } from "../../../utils/validators/schemas";
import "../styles/edit_profile_window.css";


export const EditProfileWindow = ({isOpen, closeFunc, user, setUser}) => {
    const [editUser, setEditUser] = useState({
            first_name: user.first_name,
            last_name: user.last_name,
            patronymic: user.patronymic,
            phone: '+' + user.phone?.replace(/[^\d]/g, '')
        });

    const [edit_profile_func, loading, serverError] = useFetch(
        async () => {
            await edit_profile(
                editUser.first_name,
                editUser.last_name,
                editUser.patronymic,
                editUser.phone
            )
            setUser(
                {...user,
                    first_name: editUser.first_name,
                    last_name: editUser.last_name,
                    patronymic: editUser.patronymic,
                    phone: editUser.phone
                }
            )
            closeFunc();
        }
    )

    const { error: localError, validate } = useValidation();
    const handleEdit = () => {
        if (!validate(editUser, editProfileSchema)) return;
        edit_profile_func();
    };

    return (
        <ModalWindow isOpen={isOpen} closeFunc={closeFunc} className={'edit-window-block'}>
            <h1> Редактирование профиля</h1>
            <InputBlock
                label="Имя"
                name="first_name"
                type="text"
                value={editUser.first_name}
                onChange={e => setEditUser({...editUser, first_name: e.target.value})}
                placeholder="введите ваше имя"
            />

           <InputBlock
                label="Фамилия"
                name="last_name"
                type="text"
                value={editUser.last_name}
                onChange={e => setEditUser({...editUser, last_name: e.target.value})}
                placeholder="введите вашу фамилию"
            />

            <InputBlock
                label="*Отчество"
                name="patronymic"
                type="text"
                value={editUser.patronymic}
                onChange={e => setEditUser({...editUser, patronymic: e.target.value})}
                placeholder="введите ваше отчество"
            />

            <InputBlock
                label="Телефон"
                name="phone"
                type="text"
                value={editUser.phone}
                onChange={e => setEditUser({...editUser, phone: e.target.value})}
                placeholder="введите ваш номер телефона (+7xxxxxxxxxx)"
            />
            {/* локальные ошибки */}
            {localError && <p className="errors">{localError}</p>}

            {/* Серверные ошибки */}
            {serverError && <p className="errors">{serverError}</p>}

            <PickMeButton onClick={handleEdit} className={'save-btn'}>
                {loading  ? <Loader/>  : `Сохранить`}
            </PickMeButton>
        </ModalWindow>
    )
}