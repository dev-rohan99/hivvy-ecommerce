import Login from "../pages/login/Login";
import PublicGard from "./PublicGard";

const publicRouter = [
    {
        element: <PublicGard/>,
        children: [
            {
                path: "/login",
                element: <Login />
            }
        ]
    }
];

export default publicRouter;
