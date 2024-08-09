import { useSelector } from 'react-redux';

const useAdminHook = () => {

    const { admin } = useSelector((state) => state.admin);

    return { admin };
}

export default useAdminHook;
