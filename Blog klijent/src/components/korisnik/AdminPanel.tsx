import React, { useEffect, useState } from "react";
import { BANUJ_KORISNIKA, ODBLOKIRAJ_KORISNIKA, VRATI_BANOVANE_KORISNIKE, VRATI_SVE_KORISNIKE } from "../../ApiPutanje";
import { Korisnik } from "../../models/Korisnik";
import { upakujZahtev, uputiPoziv } from "../../ServisneStvari";

interface Props
{
    prijavljenoKorisnickoIme: string
}

interface KorisnikBanovanje
{
    idKorisnika: number,
    korisnickoIme: string
}

function AdminPanel(props: Props): JSX.Element
{
    const [korisnici, setKorisnici] = useState<Partial<Korisnik>[]>([]);
    const [blokiraniKorisnici, setBlokiraniKorisnici] = useState<Partial<Korisnik>[]>([]);
    const [korisnikZaBanovanje, setKorisnikZaBanovanje] = useState<KorisnikBanovanje>({
        idKorisnika: -1,
        korisnickoIme: ""
    });
    const [razlogBanovanja, setRazlogBanovanja] = useState<string>("");

    /*======= VRACANJE KORISNIKA KOJI NISU BANOVANI ========*/
    useEffect(() => {
        uputiPoziv(VRATI_SVE_KORISNIKE)
        .then((korisnici) => {
            setKorisnici(korisnici);
        })
        .catch((greska) => {
            console.log(greska);
        });
    }, []);

    /*======= BANOVANI KORISNICI VRACANJE ========*/
    useEffect(() => {
        uputiPoziv(VRATI_BANOVANE_KORISNIKE)
        .then((banovaniKorisnici) => {
            setBlokiraniKorisnici(banovaniKorisnici);
        })
        .catch((greska) => {
            console.log(greska);
        });
    }, []);

    return(
        <main className="admin container">
            <h1 className="naslov">
                Admin
            </h1>

            <div className="prostor-za-potencijalno-banovanje"
                 style={{ display: 'flex', justifyContent: 'space-around'}}
            >
                <section className="korisnici">
                    <h2 className="naslov">
                        Svi korisnici
                    </h2>
                    { nacrtajKorisnike() }
                </section>
                { /* forma za banovanje */}
                <form className="forma-za-banovanje">
                    <p>Banuje se korisnik: { korisnikZaBanovanje.korisnickoIme } </p>
                    <textarea name="razlogBanovanja" 
                              className="kontrola objava__tekst" 
                              placeholder="Razlog banovanja" 
                              onChange={(event) => namestiRazlogBanovanja(event)}
                              id="razlogBanovanja" 
                              cols={30} 
                              rows={10}
                    ></textarea>
                    { nacrtajKontrolnoDugme() }
                </form>
            </div>

            <section className="banovani-korisnici">
                <h2 className="naslov">
                    Banovani korisnici
                </h2>
                { nacrtajBanovaneKorisnike() }
            </section>
        </main>
    );

    function nacrtajKontrolnoDugme(): JSX.Element
    {
        if(korisnikZaBanovanje.idKorisnika !== -1)
        {
            return(
                <button onClick={(event) => potvrdiBanovanje(event)}>
                    Potvrdi banovanje
                </button>
            );
        }
        else
        {
            return(
                <button onClick={(event) => setKorisnikZaBanovanje((prethodnoStanje) => {
                    return {
                        ...prethodnoStanje,
                        idKorisnika: -1,
                    }
                })}>
                    Očisti
                </button>
            );
        }
    }

    function namestiRazlogBanovanja(event: React.ChangeEvent<HTMLTextAreaElement>)
    {
        const { value: razlogBanovanja } = event.target;
        setRazlogBanovanja(razlogBanovanja);
    }


    /*=== omoguciti da korisnik ne moze da banuje samog sebe ===*/
    function nacrtajKorisnike(): JSX.Element[]
    {
        return korisnici.map((korisnik, redniBrojKorisnikaUNizu) => {
            return(
                korisnik.korisnickoIme === props.prijavljenoKorisnickoIme 
                ? <></>
                : <article className="korisnik-u-adminu"
                         key={redniBrojKorisnikaUNizu}
                >
                    <h3 className="korisnicko-ime">
                        {korisnik.korisnickoIme}
                    </h3>
                    <button className="banuj-korisnika"
                            onClick={(event) => popuniFormuZaBanovanje(event)}
                            data-idKorisnika={korisnik.id}
                            data-korisnickoIme={korisnik.korisnickoIme}
                    >
                        Banuj korisnika
                    </button>
                </article>
            );
        });
    }

    function popuniFormuZaBanovanje(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        const { target } = event;
        const kliknutoDugme = target as HTMLElement;
        
        /*dataset mora sve mala slova*/
        if(kliknutoDugme.dataset.idkorisnika && kliknutoDugme.dataset.korisnickoime)
        {
            const idKorisnika = parseInt(kliknutoDugme.dataset.idkorisnika);
            const korisnickoIme = kliknutoDugme.dataset.korisnickoime;
            setKorisnikZaBanovanje((prethodnoStanje) => {
                return {
                    ...prethodnoStanje,
                    idKorisnika: idKorisnika,
                    korisnickoIme: korisnickoIme
                }
            });
        }
    }

    function potvrdiBanovanje(event: any)
    {
        event.preventDefault();

        if(razlogBanovanja.length !== 0)
        {
            const objekatZaBanovanje = {
                idKorisnika: korisnikZaBanovanje.idKorisnika,
                razlog: razlogBanovanja
            };
    
            const stariKorisnik: Partial<Korisnik> = {
                id: korisnikZaBanovanje.idKorisnika,
                korisnickoIme: korisnikZaBanovanje.korisnickoIme
            };
    
            uputiPoziv(BANUJ_KORISNIKA, upakujZahtev("POST", objekatZaBanovanje))
            .then((odgovor) => {
                alert("Uspesno banovanje");
                
                setKorisnici(korisnici.filter(korisnik => korisnik.id !== korisnikZaBanovanje.idKorisnika));
    
                setBlokiraniKorisnici((banovaniKorisnici) => {
                    return [...banovaniKorisnici, stariKorisnik]                
                });
    
                setKorisnikZaBanovanje({
                    idKorisnika: -1,
                    korisnickoIme: ""
                });
    
            })
            .catch((greska) => {
                alert("Neuspesno banovanje");
                console.log(greska);
            });
        }
        else
        {
            alert("Mora da se unese razlog banovanja");
        }
    }

    function nacrtajBanovaneKorisnike(): JSX.Element[]
    {
        return blokiraniKorisnici.map((blokiraniKorisnik, redniBrojKorisnikaUNizu) => {
            return(
                <article className="korisnik-u-adminu"
                         key={redniBrojKorisnikaUNizu}
                >
                    <h3 className="korisnicko-ime">{blokiraniKorisnik.korisnickoIme}</h3>
                    <button className="banuj-korisnika"
                            onClick={(event) => odblokirajKorisnika(event)}
                            data-idKorisnika={blokiraniKorisnik.id}
                            data-korisnickoIme={blokiraniKorisnik.korisnickoIme}
                    >
                        Odblokiraj korisnika
                    </button>
                </article>
            );
        });
    }

    function odblokirajKorisnika(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        const { target } = event;
        const kliknutoDugme = target as HTMLElement;

        if(kliknutoDugme.dataset.idkorisnika && kliknutoDugme.dataset.korisnickoime)
        {
            const idKorisnika: number = parseInt(kliknutoDugme.dataset.idkorisnika);
            const korisnickoIme: string = kliknutoDugme.dataset.korisnickoime;
    
            uputiPoziv(ODBLOKIRAJ_KORISNIKA, upakujZahtev("POST", {idKorisnika: idKorisnika}))
            .then((odgovor) => {
                alert("Korisnik je uspešno odblokiran");
                setBlokiraniKorisnici((blokiraniKorisnici) => {
                    return blokiraniKorisnici.filter(blokiraniKorisnik => blokiraniKorisnik.id !== idKorisnika);
                });
    
                setKorisnici((korisnici) => {
                    return [...korisnici, {id: idKorisnika, korisnickoIme: korisnickoIme}]
                });
            }).catch((odgovor) => {
                alert("Javila se greška");
            });
        }

    }
}

export default AdminPanel;