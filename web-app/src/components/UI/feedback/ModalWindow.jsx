import react  from "react";
import '../styles/feedback/modal_window.css';
import { CrossIcon } from "../../icons";


export const ModalWindow = ({children, isOpen, closeFunc, className }) => {
    if (!isOpen) return null;

    return (
        <div className={`modal-window-overlay ${className || ''}`}>
            <div className="modal-block">
                <div onClick={closeFunc} className="close-btn">
                    <CrossIcon size={30} color="white"/>
                </div>
                {children}
            </div>
        </div>
    )
}
 