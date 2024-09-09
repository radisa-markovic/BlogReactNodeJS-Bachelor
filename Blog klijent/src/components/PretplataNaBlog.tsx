import React, { useState } from "react";
// import { useHistory } from "react-router";
import { POTVRDI_MEJL_ZA_PRETPLATU } from "../ApiPutanje";
import { upakujZahtev, uputiPoziv } from "../ServisneStvari";

export function PretplataNaBlog(): JSX.Element
{
    const [email, setEmail] = useState<string>("");
    const [obavestenje, setObavestenje] = useState<string>("");
    // const history = useHistory();

    return (
        <main className="container" style={{maxWidth: '50rem'}}>
            <h1 style={{marginTop: '5rem'}}>
                Pretplata na blog
            </h1>
            <p>
                Ukoliko želite da budete obavešteni o novoj objavi na blogu,
                unesite Vašu email adresu ispod. U svakom trenutku možete da otkažete
                pretplatu putem linka u samom mejlu.
            </p>
            <p style={{color: 'red', fontWeight: 700}}>
                { obavestenje }
            </p>
            <input type="email" 
                   className="kontrola" 
                   placeholder="Unesite email adresu"
                   onChange={(event) => postaviMejl(event)}
            />
            <button onClick={() => potvrdiMejl()} 
                    style={{width:'100%', padding: '1rem 2rem'}}
            >
                Potvrdi pretplatu
            </button>
        </main>
    );

    function postaviMejl(event: React.ChangeEvent<HTMLInputElement>)
    {
        const { target: poljeZaMejl } = event;
        setEmail(poljeZaMejl.value);
    }

    function potvrdiMejl()
    {
        uputiPoziv(POTVRDI_MEJL_ZA_PRETPLATU, upakujZahtev("POST", {mejl : email}))
        .then((odgovor) => {
            // history.push("/");
            alert("Uspešno registrovanje pretplate");
        }).catch((greska) => {
            console.error(greska);
            setObavestenje("Već postoji pretplata pod tim mejlom.");
        });
    }
}