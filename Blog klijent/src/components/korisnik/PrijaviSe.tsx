import React, { useState } from "react";
import { useHistory } from "react-router";
import { KORISNICI_API, PROVERI_BANOVANJE_ZA_KORISNIKA } from "../../ApiPutanje";
import useFetch from "../../customHooks/useFetch";
import { Korisnik } from "../../models/Korisnik";
import { upakujZahtev, uputiPoziv } from "../../ServisneStvari";

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

function PrijaviSe(props: NavbarProps): JSX.Element
{
    const [podaciZaPrijavu, setPodaciZaPrijavu] = useState<PodaciZaPrijavu>({
        korisnickoIme: "",
        lozinka: ""
    });

    const [greska, setGreska] = useState<GreskePrijava>({
        korisnickoImeJePogresno: false,
        lozinkaJePogresna: false
    });

    const [podaciSeCekaju, setPodaciSeCekaju] = useState<boolean>(true);

    // const { 
    //     podaciSeCekaju, 
    //     setPodaciSeCekaju,
    //     uputiZahtevKaBazi, 
    //     upakujZahtev
    // } = useFetch("", proveriGreskuKodPrijave, {});
    const history = useHistory();

    return(
        <main className="prijavi-se donja-margina-potomci">
            <form action="POST" className="forma donja-margina-potomci">
                <h1 className="title">
                    Prijavi se
                </h1>
                <article className="forma__polje">
                    <label htmlFor="korisnickoIme">
                        <input type="text" 
                               placeholder="korisnickoIme" 
                               id="korisnickoIme" 
                               name="korisnickoIme"
                               className="kontrola"
                               onChange={promenaUnosa}
                        />
                    </label>
                </article>
                { 
                    greska.korisnickoImeJePogresno && 
                    <p style={{color: 'red'}}>
                        <i className="fa-solid fa-triangle-exclamation"
                            style={{color: 'red', marginRight: '5px'}}
                        ></i>
                        Nepostojeće korisničko ime
                    </p>
                }
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
                    { 
                        greska.lozinkaJePogresna && 
                        <p style={{color: 'red'}}>
                            <i className="fa-solid fa-triangle-exclamation"
                                style={{color: 'red', marginRight: '5px'}}
                            ></i>
                            Pogrešna lozinka
                        </p>
                    }
                </article>

                <button className="forma__dugme" onClick={(event) => pokusajPrijavu(event)}>
                   Prijavi se
                </button>
            </form>
        </main>
    );

    function promenaUnosa(event: React.ChangeEvent<HTMLInputElement>): void
    {
        const { name, value } = event.target;
        setPodaciZaPrijavu({
            ...podaciZaPrijavu,
            [name]: value
        });    
    }

    function pokusajPrijavu(event: React.MouseEvent<HTMLButtonElement>): void
    {
        event.preventDefault();
        const objekatZahteva = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(podaciZaPrijavu)
        };

        uputiPoziv(`${PROVERI_BANOVANJE_ZA_KORISNIKA}/${podaciZaPrijavu.korisnickoIme}`)
        .then((podaci) => {
            if(podaci.length !== 0)
            {
                alert("Banovani ste, idete na stranicu za objasnjenje");
                history.push(`/obavestenjeOZabrani/${podaci[0].korisnickoIme}/${podaci[0].razlog}`)
            }
            else
            {
                uputiPoziv(KORISNICI_API, upakujZahtev("POST", podaciZaPrijavu))
                .then(korisnik => prijaviKorisnika(korisnik))
                .catch((greska: Response) => proveriGreskuKodPrijave(greska))
                .finally(() => setPodaciSeCekaju(false));
            }
        })
        .catch((greska) => {
            console.log(greska);
        });
    }

    function prijaviKorisnika(korisnik: any)
    {
        let adminStatus: boolean;
        if(parseInt(korisnik.admin_status) === 1)
            adminStatus = true;
        else
            adminStatus = false;

        props.setKorisnik({
            id: korisnik.id,
            korisnickoIme: korisnik.korisnickoIme,
            adminStatus: adminStatus,
            brojNeprocitanihPoruka: korisnik.brojNeprocitanihPoruka
        });

        const korisnikZaStorage = {
            id: korisnik.id,
            korisnickoIme: korisnik.korisnickoIme,
            adminStatus: adminStatus,
            brojNeprocitanihPoruka: korisnik.brojNeprocitanihPoruka
        };

        localStorage.setItem("korisnik", JSON.stringify(korisnikZaStorage));
        alert("Uspesna prijava");
        history.push("/sveObjave");
    }

    function proveriGreskuKodPrijave(greska: Response)
    {
        console.log(greska);
        setGreska({...greska, korisnickoImeJePogresno: false, lozinkaJePogresna: false});
        
        switch(greska.statusText)
        {
            case "Nepostojece korisnicko ime":
                setGreska({korisnickoImeJePogresno: true});
                break;
            
            case "Lozinka je netacna":
                setGreska({lozinkaJePogresna: true});
                break;

            default:
                break;
        }

    }
}

export default PrijaviSe;