import React, { useState } from "react";
import { useHistory } from "react-router";
import { PRETRAZI_KORISNICKO_IME, UPISI_PORUKU } from "../../ApiPutanje";
import { Poruka } from "../../models/Poruka";
import { upakujZahtev, uputiPoziv, vratiDatumPisanja } from "../../ServisneStvari";
import UnosSaPredlozima from "../UnosSaPredlozima";

interface Props
{
    korisnickoIme: string,
    primalacPoruke?: string
}

export default function NapisiPoruku(props: Props): JSX.Element
{
    const [poruka, setPoruka] = useState<Partial<Poruka>>({
        id: -1,
        imePosiljaoca: "",
        imePrimaoca: "",
        naslov: "",
        sadrzaj: "",
        datumSlanja: "",
        procitana: false
    });
    const history = useHistory();

    return(
        <main className="container">
            <h1 className="naslov">
                Napiši poruku
            </h1>
            <form action="" 
                  onSubmit={(event) => posaljiPoruku(event)}
                  className="poruka__forma-za-pisanje"
                  autoComplete="off"
            >
                <input type="text" 
                       name="naslov" 
                       className="kontrola"
                       id="naslov"
                       placeholder="Naslov poruke" 
                       onChange={promenaUnosa}
                />
                {/* <input type="text" 
                       name="imePrimaoca" 
                       className="kontrola"
                       id="imePrimaoca" 
                       placeholder="Korisničko ime primaoca"
                       onChange={promenaUnosa}
                /> */}
                <UnosSaPredlozima onChangeHandler={promenaUnosa} 
                                  bindingPropertyName="imePrimaoca"
                                  setPropertyName={setPoruka}
                                  urlPutanja={PRETRAZI_KORISNICKO_IME}
                                  placeholder="Ime primaoca"
                />
                <textarea name="sadrzaj" 
                          className="kontrola objava__tekst"
                          placeholder="Sadržaj poruke"
                          id="objavaTekst" 
                          cols={30}
                          rows={10}
                          onChange={promenaUnosa}
                ></textarea>

                <button className="poruka__posalji objava__dugme">
                    Pošalji poruku
                </button>
            </form>
        </main>
    );

    /*=== pogledati webDevSimplified za useState, u principu gazio sam staro stanje ===*/
    function promenaUnosa(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void
    {
        const { name, value } = event.target;
        setPoruka((poruka) => {
            console.log(poruka);

            return {
                ...poruka,
                [name]: value
            }
        });
    }

    function posaljiPoruku(event: React.FormEvent): void
    {
        event.preventDefault();
        poruka.datumSlanja = vratiDatumPisanja();
        poruka.imePosiljaoca = props.korisnickoIme;
        console.log(poruka);

        uputiPoziv(UPISI_PORUKU, upakujZahtev("POST", poruka))
        .then((odgovor) => {
            alert("Poruka uspesno poslata");
            console.log(odgovor);
            history.push("/");
        })
        .catch((greska) => {
            alert("Doslo je do greske");
            console.log(greska);
        });
    }
}