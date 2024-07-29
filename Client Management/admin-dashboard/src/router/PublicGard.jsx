import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicGard = () => {

    const { admin } = useSelector((state) => state.admin);

    if(localStorage.getItem("admin")){
        return admin ? <Navigate to={"/"}/> : <Outlet/>;
    }
    return <Outlet/>;

}

export default PublicGard;
