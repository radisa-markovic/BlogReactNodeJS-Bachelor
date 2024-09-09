import React, { useEffect, useState } from "react";
import { UPISI_PORUKU, VRATI_KORISNIKOVE_PORUKE } from "../../ApiPutanje";
import { Poruka } from "../../models/Poruka";
import { upakujZahtev, uputiPoziv } from "../../ServisneStvari";
import PorukaView from "./PorukaView";

interface Props
{
    korisnickoIme: string;
}

function SpisakPoruka(props: Props): JSX.Element
{
    const [poruke, setPoruke] = useState<Poruka[]>([]);
    const [tipPoruka, setTipPoruka] = useState<string>("poslatePoruke");
    const { korisnickoIme } = props;

    useEffect(() => {
        uputiPoziv(`${VRATI_KORISNIKOVE_PORUKE}/${korisnickoIme}/${tipPoruka}`)
        .then((poruke: Poruka[]) => {
            console.log(poruke);
            if(poruke)
            {
                poruke.forEach((poruka) => console.log(poruka.procitana.data[0]));
                setPoruke(poruke);
            }
        })
        .catch((greska) => {
            console.log(greska);
        });
    }, [tipPoruka]);

    return(
        <section className="poruka__spisak container">
            <header className="poruka__spisak-zaglavlje">
                <h1 className="naslov">
                    Vaše poruke
                </h1>
                <select name="filterPoruka" 
                        id="filterPoruka"
                        className="poruka__spisak-filter"
                        onChange={(event) => filtrirajPoruke(event)}
                >
                    <option value="poslatePoruke" selected>
                        Poslate poruke
                    </option>
                    <option value="primljenePoruke">
                        Primljene poruke
                    </option>
                </select>
            </header>
            <div>
                { nacrtajPoruke() }
            </div>
        </section>
    );

    function nacrtajPoruke(): JSX.Element[] | JSX.Element
    {
        if(poruke.length === 0)
        {
            return (<p className="obavestenje">Nemate nijednu poruku</p>);
        }
        else
        {
            return poruke.map((poruka, indeks) => {
                return (
                    <PorukaView poruka={poruka} 
                                key={indeks * 10}
                                odgovoriNaPoruku={odgovoriNaPoruku}    
                                tipPrikazanihPoruka={tipPoruka}        
                    />
                )
            });
        }
    }

    function odgovoriNaPoruku(odgovor: Poruka)
    {
        odgovor.imePosiljaoca = props.korisnickoIme;
        uputiPoziv(UPISI_PORUKU, upakujZahtev("POST", odgovor))
        .then((odgovor) => {
            alert("Poruka uspesno poslata");
            console.log(odgovor);
            // history.push("/");
        })
        .catch((greska) => {
            alert("Doslo je do greske");
            console.log(greska);
        });
    }

    function filtrirajPoruke(event: React.ChangeEvent<HTMLSelectElement>): void
    {
        const { value: odabranePoruke } = event.target;
        console.log(odabranePoruke);
        setTipPoruka(odabranePoruke);

        uputiPoziv(`${VRATI_KORISNIKOVE_PORUKE}/${korisnickoIme}/${odabranePoruke}`)
        .then((poruke) => {
            setPoruke(poruke);
        })
        .catch((greska) => {
            console.log(greska);
        });
    }
}

export default SpisakPoruka;