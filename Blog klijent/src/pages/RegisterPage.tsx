import { ActionFunctionArgs, Form, redirect, useActionData } from "react-router-dom";

import styles from './Forms.module.css';

import FormError from "../components/FormError";
import { authProvider } from "../api/auth";

const API_BASE: string = "http://localhost:3002";

const USERNAME_FORM_KEY: string = "username";
const EMAIL_FORM_KEY: string = "email";
const PASSWORD_FORM_KEY: string = "password";

export const registerLoader = async () => {
    await authProvider.checkAuthStatus();
    if(authProvider.accessToken)
    {
        return redirect("/");
    }

    return null;
}

const RegisterPage: React.FC<any> = () => {
    const actionData = useActionData() as { emailError: string, usernameError: string, passwordError: string } | undefined;

    return (
        <section className="napravi-nalog donja-margina-potomci">
            <Form 
                method="POST"
                action="/register" 
                className="forma donja-margina-potomci"
            >
                <h1 className="title">
                    Create account
                </h1>
                { 
                    actionData?.emailError && <FormError errorText={actionData.emailError}/>
                }
                <div>
                    <label 
                        htmlFor={EMAIL_FORM_KEY} 
                        className={styles.label}
                    >
                        Email:
                    </label>
                    <input 
                        type="email" 
                        name={EMAIL_FORM_KEY} 
                        id="email" 
                        className={styles.kontrola}
                    />
                </div>
                <article className="forma__polje">
                    { 
                        actionData?.usernameError && <FormError errorText={actionData.usernameError}/>
                    }
                    <label 
                        htmlFor={USERNAME_FORM_KEY}
                        className={styles.label}
                    >
                        Username:
                    </label>
                    <input 
                        type="text"  
                        id="korisnickoIme" 
                        name={USERNAME_FORM_KEY}
                        className={styles.kontrola}
                    />
                </article>
                <article className="forma__polje">
                    { 
                        actionData?.passwordError && <FormError errorText={actionData.passwordError}/>
                    }
                    <label 
                        htmlFor={PASSWORD_FORM_KEY} 
                        className={styles.label}>
                        Password:
                    </label>
                    <input 
                        type="password" 
                        id="lozinka"
                        name={PASSWORD_FORM_KEY}
                        className={styles.kontrola}
                    />
                </article>

                <button 
                    className="forma__dugme" 
                    type="submit"
                >
                    Napravi nalog
                </button>
            </Form>
        </section>
    );
}

export async function action({ request }: ActionFunctionArgs)
{
    const formData = await request.formData();
    //check for errors
    const email = formData.get(EMAIL_FORM_KEY);
    const username = formData.get(USERNAME_FORM_KEY);
    const password = formData.get(PASSWORD_FORM_KEY);
    let registerErrors: {
        emailError?: string,
        usernameError?: string,
        passwordError?: string
    } = {};

    if(!email || email.toString().trim().length < 5)
        registerErrors.emailError = "Email too short";
    if(!username || username.toString().trim().length < 4)
        registerErrors.usernameError = "Username must be at least 5 characters long";
    if(!password || password.toString().length < 8)
        registerErrors.passwordError = "Password must be at least 8 characters long";

    if(Object.keys(registerErrors).length)
        return registerErrors;

    //else attempt the registration process

    const apiRequest: RequestInit = {
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

    const response = await fetch(API_BASE + "/users/create", apiRequest);
    if(response.ok && response.statusText === "Created")
    {
        alert("User successfully created");
        // history.push("/prijaviSe");
        return null;
    }
    else
    {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        jsonResponse.errors.forEach((error: any) => {
            //@ts-ignore
            registerErrors[error.path + 'Error'] = error.msg;
        });
        
        return registerErrors;
    }
    
}

export default RegisterPage;