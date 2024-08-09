import { RouterProvider } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import router from "./router/router";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAdminMessageEmpty } from "./app/features/admin/adminSlice";
import { getAllClient, getAllEmployee, getAllOrder, getLoggedinAdmin } from "./app/features/admin/adminApiSlice";

function App() {

  const dispatch = useDispatch();
  const { error, message } = useSelector((state) => state.admin);

  useEffect(() => {
    if(error){
        dispatch(setAdminMessageEmpty());
    }
    if(message){
        dispatch(setAdminMessageEmpty());
    }
  }, [error, message]);

  useEffect(() => {
    dispatch(getAllEmployee());
    dispatch(getAllClient());
    dispatch(getAllOrder());
  }, [dispatch]);

  useEffect(() => {
    if(localStorage.getItem("admin")){
      dispatch(getLoggedinAdmin());
    }
  }, [dispatch]);

  return (
    <>

      <ToastContainer
        style={{zIndex:"9999999"}}
        hideProgressBar={true}
        position="bottom-left"
        autoClose={3000}
        newestOnTop={true}
        closeOnClick
      />
      
      <RouterProvider router={router} />

    </>
  )
}

export default App;
