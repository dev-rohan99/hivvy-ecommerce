import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateGard = () => {

    const { admin } = useSelector((state) => state.admin);

    return admin ? <Outlet/> : <Navigate to={"login"}/>;
    
}

export default PrivateGard;
