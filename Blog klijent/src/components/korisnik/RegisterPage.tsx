import React, { useState } from "react";
import FormError from "../FormError";
import { authProvider } from "../../api/auth";
import { redirect } from "react-router-dom";

const API_BASE: string = "http://localhost:3002";

//@ts-ignore
export const registerAction = async ({ request, params }) => {
    const formData = await request.formData();
    const email = formData;
}

export const registerLoader = async () => {
    await authProvider.checkAuthStatus();
    if(authProvider.accessToken)
    {
        return redirect("/");
    }

    return null;
}

const RegisterPage: React.FC<any> = () => {
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');

    const [username, setUsername] = useState<string>('');
    const [usernameError, setUsernameError] = useState<string>('');
   
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
   
    // const history = useHistory();

    const createAccount = (event: React.MouseEvent) => {
        event.preventDefault();
        setEmailError('');
        setUsernameError('');
        setPasswordError('');

        const request: RequestInit = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            mode: 'cors',
            body: JSON.stringify({
                email,
                username,
                password
            })
        };

        fetch(API_BASE + "/users/create", request)
            .then((response) => {
                //here I have the response statusCode etc
                //after response.json() I don't have it anymore 
                if(response.ok && response.statusText === "Created")
                {
                    alert("User successfully created");
                    // history.push("/prijaviSe");
                }
                else
                {
                    return response.json();
                }
            })
            .then((response) => {
                // console.log(response.status);
                // console.log(response.statusCode);
                const error = new Error(response.message);
                //@ts-ignore
                error.errors = response.errors;
                throw error;
            })
            .catch((error) => {
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
                        case 'email':
                            setEmailError(error.msg);
                            break;
                        case 'password':
                            setPasswordError(error.msg);
                            break;
                        default:
                            break; 
                    }
                });
            });
    }

    return (
        <section className="napravi-nalog donja-margina-potomci">
            <form action="POST" className="forma donja-margina-potomci">
                <h1 className="title">
                    Create account
                </h1>
                { 
                    emailError !== '' && 
                    <FormError errorText={emailError}/>
                }
                <div>
                    <label htmlFor="email" style={{fontSize: '16px'}}>
                        Email:
                    </label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        className="kontrola"
                        onChange={({target}) => setEmail(target.value)}    
                    />
                </div>
                <article className="forma__polje">
                    { 
                        usernameError !== '' && 
                        <FormError errorText={usernameError}/>
                    }
                    <label htmlFor="korisnickoIme" style={{fontSize: '16px'}}>
                        Username:
                        <input 
                            type="text" 
                            placeholder="Korisnicko ime" 
                            id="korisnickoIme" 
                            name="korisnickoIme"
                            className="kontrola"
                            onChange={({target}) => setUsername(target.value)}
                        />
                    </label>
                </article>
                <article className="forma__polje">
                    { 
                        passwordError !== '' && 
                        <FormError errorText={passwordError}/>
                    }
                    <label htmlFor="lozinka" style={{fontSize: '16px'}}>
                        Password:
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
                    className="forma__dugme" 
                    onClick={(event) => createAccount(event)}
                >
                    Napravi nalog
                </button>
            </form>
        </section>
    );
}

export default RegisterPage;