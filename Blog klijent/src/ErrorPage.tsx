import { useRouteError } from "react-router-dom";
import Navbar from "./components/Navbar";

const ErrorPage: React.FC<any> = () => {
    let error = useRouteError() as any;
    console.log(error.data.message);

    return (
        <>
            <Navbar/>
            <h1 style={{textAlign: 'center'}}>
                Something went wrong
            </h1>
            <p style={{fontSize: '70px', textAlign: 'center'}}>
                { error.data.message }
            </p>
        </>
    )
}

export default ErrorPage;