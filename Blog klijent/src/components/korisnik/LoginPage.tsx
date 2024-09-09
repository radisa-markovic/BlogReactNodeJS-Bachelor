import { 
    Form, 
    useActionData,
    redirect,
    LoaderFunctionArgs
} from "react-router-dom";

import FormError from "../FormError";
import { authProvider } from "../../api/auth";

const USERNAME_KEY_NAME: string = "username";
const PASSWORD_KEY_NAME: string = "password";

interface LoginErrors
{
    usernameError?: string;
    passwordError?: string;
};

interface LoginResponse
{
    id: number;
    username: string;
    accessToken: string;
};

const LoginPage: React.FC<any> = () => {
    const actionData = useActionData() as LoginErrors | undefined;

    return(
        <main className="prijavi-se donja-margina-potomci">
            <Form 
                className="forma donja-margina-potomci"
                method="POST"
                replace
            >
                <h1 className="title">
                    Prijavi se
                </h1>
                { 
                    actionData?.usernameError && 
                    <FormError errorText={actionData.usernameError}/>
                }
                <article className="forma__polje">
                    <label htmlFor="korisnickoIme">
                        <input 
                            type="text" 
                            placeholder="korisnickoIme" 
                            id="korisnickoIme" 
                            name={USERNAME_KEY_NAME}
                            className="kontrola"
                        />
                    </label>
                </article>
                { 
                    actionData?.passwordError && 
                    <FormError errorText={actionData.passwordError} /> 
                }
                <article className="forma__polje">
                    <label htmlFor="lozinka">
                        <input 
                            type="password" 
                            placeholder="Lozinka"
                            id="lozinka"
                            name={PASSWORD_KEY_NAME}
                            className="kontrola"
                        />
                    </label>
                </article>

                <button 
                    type="submit"
                    className="forma__dugme" 
                >
                   Prijavi se
                </button>
            </Form>
        </main>
    );
}

export async function loginLoader()
{
    if(authProvider.accessToken)
    {
        return redirect("/");
    }

    return null;
}

export async function loginAction({ request }: LoaderFunctionArgs)
{
    let loginErrors: LoginErrors = {};
    const formData = await request.formData();

    const username: string | undefined = formData.get(USERNAME_KEY_NAME)?.toString();
    const password: string | undefined = formData.get(PASSWORD_KEY_NAME)?.toString();

    if(!username || username.trim().length < 4)
        loginErrors.usernameError = "Username must be at least 4 characters long";
    
    if(!password || password.trim().length < 8)
        loginErrors.passwordError = "Password must be at least 8 characters long";

    //if there are errors
    if(Object.keys(loginErrors).length)
        return loginErrors;

    //else submit the login request
    //it could be fairly certainly told that the data is defined here
    try
    {
        const response = await authProvider.login(username!, password!);
        if(!response.ok)
        {
            const errors = await response.json() as LoginErrors;

            if(errors.usernameError)
                loginErrors.usernameError = errors.usernameError;

            if(errors.passwordError)
                loginErrors.passwordError = errors.passwordError;

            return errors;
        }
        else
        {
            const userData = await response.json() as LoginResponse;
            authProvider.accessToken = userData.accessToken;
            authProvider.userData = {
                id: userData.id,
                username: userData.username
            };

            // let redirectTo = formData.get("redirectTo") as string | null;
            // return redirect(redirectTo || "/"); 
            return redirect("/posts");
        }
    }
    catch(error)
    {
        //some unspecified error, should be better handled
        console.log(error);
        return error;
    }
}

export default LoginPage;