import React, { useState } from "react";
import { useHistory } from "react-router";
import { OSNOVNI_PUT } from "../../ApiPutanje";
import { upakujZahtev, uputiPoziv } from "../../ServisneStvari";

interface PodaciZaNalog
{
    korisnickoIme: string,
    lozinka: string,
    email: string
}

function NapraviNalog(): JSX.Element
{
    const [podaciZaNalog, setPodaciZaNalog] = useState<PodaciZaNalog>({
        korisnickoIme: "",
        lozinka: "",
        email: ""
    });
    const [korisnickoImeZauzeto, setKorisnickoImeJeZauzeto] = useState<boolean>(false);
    const history = useHistory();

    return (
        <section className="napravi-nalog donja-margina-potomci">
            <form action="POST" className="forma donja-margina-potomci">
                <h1 className="title">
                    Napravi nalog
                </h1>
                <article className="forma__polje">
                    <label htmlFor="korisnickoIme">
                        <input type="text" 
                               placeholder="Korisnicko ime" 
                               id="korisnickoIme" 
                               name="korisnickoIme"
                               className="kontrola"
                               onChange={promenaUnosa}
                        />
                        { 
                            korisnickoImeZauzeto && 
                            <p style={{color: 'red'}}>
                                <i className="fa-solid fa-triangle-exclamation"
                                   style={{color: 'red', marginRight: '5px'}}
                                ></i>
                                Korisničko ime je zauzeto
                            </p>
                        }
                    </label>
                </article>
                <article className="forma__polje">
                    <label htmlFor="lozinka">
                        <input type="password" 
                               placeholder="Lozinka"
                               id="lozinka"
                               name="lozinka"
                               className="kontrola"
                               onChange={promenaUnosa}
                        />
                    </label>
                </article>

                <button className="forma__dugme" onClick={(event) => napraviNalog(event)}>
                    Napravi nalog
                </button>
            </form>
        </section>
    );

    function promenaUnosa(event: React.ChangeEvent<HTMLInputElement>): void
    {
        const { name, value } = event.target;
        setPodaciZaNalog({
            ...podaciZaNalog,
            [name]: value
        });    
    }

    function napraviNalog(event: React.FormEvent<HTMLButtonElement>): void
    {
        event.preventDefault();
        setKorisnickoImeJeZauzeto(false);

        const objekatZahteva = upakujZahtev("POST", podaciZaNalog);
       
        uputiPoziv(`${OSNOVNI_PUT}/napraviNalog`, objekatZahteva) 
        .then(odgovor => {
            alert("Pravljenje naloga je uspelo");
            history.push("/prijaviSe");
        })
        .catch((greska: Response) => {
            console.log(greska);
            
            if(greska.statusText === "ER_DUP_ENTRY")
            {
                setKorisnickoImeJeZauzeto(true);
            }
        })

    }
}

export default NapraviNalog;