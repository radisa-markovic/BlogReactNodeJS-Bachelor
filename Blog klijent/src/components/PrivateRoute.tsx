import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { RouteNames } from "../routes";
// import { Redirect, Route } from "react-router-dom";


const PrivateRoute: React.FC<any> = ({children, ...props}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isPending, setIsPending] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = async () => {
            // debugger;
            setIsPending(true);
            if(!props.accessToken)
            {
                return setIsAuthenticated(false);
            }

            const response = await fetch("http://localhost:3002/users/auth", {
                headers: {
                    'Authorization': 'Bearer ' + props.accessToken,
                },
                credentials: 'include',
                mode: 'cors',
                method: "POST"
            });
            
            setIsPending(false)

            if(response.ok)
            {
                return setIsAuthenticated(true);
            }

            if(response.status === 401)
            {
                alert("Unauthorized request");
            }
        }

        checkAuth();
    }, []);

    if(!isAuthenticated)
    {
        return <Navigate to={RouteNames.loginPage}/>
    }

    return <Outlet/>
}

export default PrivateRoute;