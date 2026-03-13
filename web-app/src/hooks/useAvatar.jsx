import { useAuth } from "../contexts/AuthContext";
import { AVATARS } from "../pages/auth/utils/avatars_data";


export const useAvatar = () => {
    const { userAuth } = useAuth();
    
    const getAvaKey = () => {
        if (!userAuth?.id) return null;
        return `user_${userAuth.id}_ava`;
    };

    const putAvatar = (ava) => {
        const key = getAvaKey();
        if (key) {
            localStorage.setItem(key, ava);
        }
    };

    const getAvatar = () => {
        const key = getAvaKey();
        if (!key) return AVATARS.ava_1;
        
        const ava = AVATARS[localStorage.getItem(key)];
        return ava || AVATARS.ava_1;
    };

    return {
        putAvatar,
        getAvatar
    };
};