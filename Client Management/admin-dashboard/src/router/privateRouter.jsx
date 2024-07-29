import DashboardLayout from "../components/dashboard-layout/DashboardLayout";
import Client from "../pages/client/Client";
import Dashboard from "../pages/dashboard/Dashboard";
import Invoice from "../pages/invoice/Invoice";
import Orders from "../pages/orders/Orders";
import Profile from "../pages/profile/Profile";
import PrivateGard from "./PrivateGard";


const privateRouter = [
    {
        element: <DashboardLayout/>,
        children: [
            {
                element: <PrivateGard/>,
                children: [
                    {
                        path: "/",
                        element: <Dashboard />
                    },
                    
                    {
                        path: "/dashboard/profile",
                        element: <Profile />
                    },
                    
                    {
                        path: "/dashboard/orders",
                        element: <Orders />
                    },
                    
                    {
                        path: "/dashboard/clients",
                        element: <Client />
                    },
                    
                    {
                        path: "/dashboard/invoices",
                        element: <Invoice />
                    }
                ]
            }
        ]
    }
];

export default privateRouter;
