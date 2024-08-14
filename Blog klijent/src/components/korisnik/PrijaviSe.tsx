import React, { useState } from "react";
import { useHistory } from "react-router";

import FormError from "../FormError";

interface AppProps
{
    setAccessToken: React.Dispatch<React.SetStateAction<string>>;
    setUserData: React.Dispatch<React.SetStateAction<{
        id: number;
        username: string;
    }>>
}

const API_BASE: string = "http://localhost:3002";

const PrijaviSe: React.FC<AppProps> = ({ setAccessToken, setUserData }) => {
    const [username, setUsername] = useState<string>('');
    const [usernameError, setUsernameError] = useState<string>('');

    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');

    const [isPending, setIsPending] = useState<boolean>(false);

    const history = useHistory();

    const attemptLogin = async () => {
        setIsPending(true);
        setUsernameError('');
        setPasswordError('');

        const request: RequestInit = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            mode: 'cors',
            /**==>> must be present for cookies to be set */
            credentials: "include",
            body: JSON.stringify({
                username,
                password
            })
        };

        try
        {
            const response = await fetch(API_BASE + "/users/login", request);
            if(!response.ok)
            {
                const errors = await response.json();
                const loginError = new Error();
                //@ts-ignore
                loginError.errors = errors.errors;
                throw loginError;
            }
            alert("User logged in");
            const loginResponse = await response.json();
            setAccessToken(loginResponse.accessToken);
            setUserData({
                id: loginResponse.id,
                username: loginResponse.username
            });

            history.push("/sveObjave");
        }
        catch(error: any)
        {
            interface ValidationError {
                location: string, 
                msg: string, 
                path: string, 
                type: string, 
                value: string
            }
            error.errors.forEach((error: ValidationError) => {
                switch(error.path)
                {
                    case 'username':
                        setUsernameError(error.msg);
                        break;
                    case 'password':
                        setPasswordError(error.msg);
                        break;
                    default:
                        break; 
                }
            });
        }
    }

    return(
        <main className="prijavi-se donja-margina-potomci">
            <form 
                className="forma donja-margina-potomci"
            >
                <h1 className="title">
                    Prijavi se
                </h1>
                { 
                    usernameError !== "" &&
                    <FormError errorText={usernameError}/>
                }
                <article className="forma__polje">
                    <label htmlFor="korisnickoIme">
                        <input 
                            type="text" 
                            placeholder="korisnickoIme" 
                            id="korisnickoIme" 
                            name="korisnickoIme"
                            className="kontrola"
                            onChange={({target}) => setUsername(target.value)}
                        />
                    </label>
                </article>
                { 
                    passwordError !== "" &&
                    <FormError errorText={passwordError} /> 
                }
                <article className="forma__polje">
                    <label htmlFor="lozinka">
                        <input 
                            type="password" 
                            placeholder="Lozinka"
                            id="lozinka"
                            name="lozinka"
                            className="kontrola"
                            onChange={({target}) => setPassword(target.value)}
                        />
                    </label>
                </article>

                <button 
                    type="button"
                    className="forma__dugme" 
                    onClick={() => attemptLogin()}
                >
                   Prijavi se
                </button>
            </form>
        </main>
    );
}

export default PrijaviSe;