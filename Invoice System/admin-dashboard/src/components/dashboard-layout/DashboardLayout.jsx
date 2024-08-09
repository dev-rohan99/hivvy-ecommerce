import React from 'react';
import { Outlet  } from "react-router-dom";
import DashboardHeader from '../dashboard-header/DashboardHeader';
import DashboardSidebar from '../dashboard-sidebar/DashboardSidebar';


const DashboardLayout = () => {



    return (
        <>
            
            <div className="main-wrapper">

                <DashboardHeader/>
                
                <DashboardSidebar/>

                <Outlet/>

            </div>

        </>
    )
}

export default DashboardLayout;
