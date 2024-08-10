import React, { useState } from "react";
import { useHistory } from "react-router";
import { KORISNICI_API, PROVERI_BANOVANJE_ZA_KORISNIKA } from "../../ApiPutanje";
import useFetch from "../../customHooks/useFetch";
import { Korisnik } from "../../models/Korisnik";
import { upakujZahtev, uputiPoziv } from "../../ServisneStvari";
import FormError from "../FormError";

interface PodaciZaPrijavu
{
    korisnickoIme: string,
    lozinka: string
}

interface NavbarProps
{
    korisnickoIme: string,
    setKorisnik: React.Dispatch<React.SetStateAction<Korisnik>>;
}

interface GreskePrijava
{
    korisnickoImeJePogresno?: boolean,
    lozinkaJePogresna?: boolean
}

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

    // const [podaciZaPrijavu, setPodaciZaPrijavu] = useState<PodaciZaPrijavu>({
    //     korisnickoIme: "",
    //     lozinka: ""
    // });

    // const [greska, setGreska] = useState<GreskePrijava>({
    //     korisnickoImeJePogresno: false,
    //     lozinkaJePogresna: false
    // });

    // const [podaciSeCekaju, setPodaciSeCekaju] = useState<boolean>(true);

    // const { 
    //     podaciSeCekaju, 
    //     setPodaciSeCekaju,
    //     uputiZahtevKaBazi, 
    //     upakujZahtev
    // } = useFetch("", proveriGreskuKodPrijave, {});

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

    // function promenaUnosa(event: React.ChangeEvent<HTMLInputElement>): void
    // {
    //     const { name, value } = event.target;
    //     setPodaciZaPrijavu({
    //         ...podaciZaPrijavu,
    //         [name]: value
    //     });    
    // }

    // function pokusajPrijavu(event: React.MouseEvent<HTMLButtonElement>): void
    // {
    //     event.preventDefault();
    //     const objekatZahteva = {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         method: "POST",
    //         body: JSON.stringify(podaciZaPrijavu)
    //     };

    //     uputiPoziv(`${PROVERI_BANOVANJE_ZA_KORISNIKA}/${podaciZaPrijavu.korisnickoIme}`)
    //     .then((podaci) => {
    //         if(podaci.length !== 0)
    //         {
    //             alert("Banovani ste, idete na stranicu za objasnjenje");
    //             history.push(`/obavestenjeOZabrani/${podaci[0].korisnickoIme}/${podaci[0].razlog}`)
    //         }
    //         else
    //         {
    //             uputiPoziv(KORISNICI_API, upakujZahtev("POST", podaciZaPrijavu))
    //             .then(korisnik => prijaviKorisnika(korisnik))
    //             .catch((greska: Response) => proveriGreskuKodPrijave(greska))
    //             .finally(() => setPodaciSeCekaju(false));
    //         }
    //     })
    //     .catch((greska) => {
    //         console.log(greska);
    //     });
    // }

    // function prijaviKorisnika(korisnik: any)
    // {
    //     let adminStatus: boolean;
    //     if(parseInt(korisnik.admin_status) === 1)
    //         adminStatus = true;
    //     else
    //         adminStatus = false;

    //     props.setKorisnik({
    //         id: korisnik.id,
    //         korisnickoIme: korisnik.korisnickoIme,
    //         adminStatus: adminStatus,
    //         brojNeprocitanihPoruka: korisnik.brojNeprocitanihPoruka
    //     });

    //     const korisnikZaStorage = {
    //         id: korisnik.id,
    //         korisnickoIme: korisnik.korisnickoIme,
    //         adminStatus: adminStatus,
    //         brojNeprocitanihPoruka: korisnik.brojNeprocitanihPoruka
    //     };

    //     localStorage.setItem("korisnik", JSON.stringify(korisnikZaStorage));
    //     alert("Uspesna prijava");
    //     history.push("/sveObjave");
    // }

    // function proveriGreskuKodPrijave(greska: Response)
    // {
    //     console.log(greska);
    //     setGreska({...greska, korisnickoImeJePogresno: false, lozinkaJePogresna: false});
        
    //     switch(greska.statusText)
    //     {
    //         case "Nepostojece korisnicko ime":
    //             setGreska({korisnickoImeJePogresno: true});
    //             break;
            
    //         case "Lozinka je netacna":
    //             setGreska({lozinkaJePogresna: true});
    //             break;

    //         default:
    //             break;
    //     }

    // }
}

export default PrijaviSe;