import { toast } from "react-toastify"


const createToast = (message, type) => {

    switch(type){

        case 'error':
            toast.error(message);
            break;

        case 'success':
            toast.success(message);
            break;

        case 'warn':
            toast.warn(message);
            break;

        case 'info':
            toast.info(message);
            break;

        default:
            break

    }

}

export default createToast;
