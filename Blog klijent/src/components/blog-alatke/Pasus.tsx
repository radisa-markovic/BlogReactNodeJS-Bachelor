import React, { useState } from "react";
import { isBuffer } from "util";
import { TipoviPasusa } from "../../models/TipoviPasusa";
import { PasusMeta } from "../blog/NapisiObjavu";
import UnosSlike from "./UnosSlike";

interface Props
{
    redniBroj: number,
    pasus: PasusSadrzaj,
    ukloniPasus: (redniBroj: number) => void,
    urediPasus?: (redniBrojPasusa: number, podnaslov: string, sadrzaj: string) => void,
    dodajSlike: Function,
    postaviPasus: React.Dispatch<React.SetStateAction<PasusMeta[]>>
}

interface PasusSadrzaj
{
    podnaslov: string,
    sadrzaj: string
}

export default function Pasus(props: Props): JSX.Element
{
    // const [pasus, setPasus] = useState<PasusSadrzaj>({
    //     podnaslov: "",
    //     sadrzaj: ""
    // });
    const [pasusSeUredjuje, setPasusSeUredjuje] = useState<boolean>(true);
    const [vrstaPasusa, setVrstaPasusa] = useState<string>("");

    return(
        <>
            <div className="kontrole-za-pasus" style={{display: "flex", gap: "2rem"}}>
                <button onClick={(event) => urediIliPregledajPasus(event)}>
                    Uredi pasus
                </button>
                <button className="ukloni-pasus"
                        onClick={() => ukloniPasus()}
                >
                    Ukloni pasus
                </button>
            </div>
            <select name="vrstaPasusa" 
                    id="vrstaPasusa"
                    className="kontrola" 
                    onChange={(event) => promeniVrstuPasusa(event)}
            >
                <option value={ TipoviPasusa.TEKSTUALNI_PASUS }>
                    Klasican tekstualni pasus
                </option>
                <option value={ TipoviPasusa.BLOKOVSKA_SLIKA }>
                    Blokovska slika
                </option>
                <option value={ TipoviPasusa.SLIKA_SA_BLOKOM_TEKSTA }>
                    Tekstualni pasus sa slikom pored
                </option>
            </select>
            { prikaziPasus() }
            {/* { pasusSeUredjuje? prikaziUredjivanje() : prikaziGotovPasus() } */}
        </>
    );

    function promeniVrstuPasusa(event: React.ChangeEvent<HTMLSelectElement>)
    {
        const { value: odabraniTipPasusa } = event.target;
        console.log(odabraniTipPasusa);
        setVrstaPasusa(odabraniTipPasusa);
        props.postaviPasus((stanje) => {
            stanje[props.redniBroj].vrstaPasusa = odabraniTipPasusa
            return stanje;
        });
    }

    function prikaziPasus(): JSX.Element
    {
        if(vrstaPasusa === "" ||  vrstaPasusa === "klasicanTekstualniPasus")
        {
            
            return prikaziUredjivanje();
        }

        if(vrstaPasusa === "blokovskaSlika")
        {
           
            return <UnosSlike slikaJeNaslovna={false}
                              postaviSlikeSaBloga={props.dodajSlike}
                              urlStareSlike={""}
                    />
        }

        if(vrstaPasusa === "tekstualniPasusSaSlikomPored")
        {
            return (
                <div className="dve-kolone">
                    <UnosSlike slikaJeNaslovna={false}
                              postaviSlikeSaBloga={props.dodajSlike}
                              urlStareSlike={""}
                    />
                    <textarea name="sadrzaj" 
                            className="kontrola objava__tekst"
                            value={props.pasus.sadrzaj}
                            id="objavaTekst" 
                            onChange={promenaUnosa}
                    >
                    </textarea>
                </div>
            );
        }

        return <></>;
    }

    function prikaziUredjivanje(): JSX.Element
    {
        return (
            <div>
                <h2>
                    Podnaslov: <input type="text" 
                                      name="podnaslov" 
                                      value={props.pasus.podnaslov}
                                      onChange={promenaUnosa}
                               />
                </h2>
                <p>Pasus:</p>
                <textarea name="sadrzaj" 
                            className="kontrola objava__tekst"
                            value={props.pasus.sadrzaj}
                            id="objavaTekst" 
                            onChange={promenaUnosa}
                >
                </textarea>
            </div>
        );
    }

    // function prikaziBlokZaSliku(): JSX.Element
    // {
    //     return <UnosSlike postaviURLFotografije={() => {}}/>;
    // }

    function prikaziSlikuUzPasus()
    {

    }

    function prikaziGotovPasus(): JSX.Element
    {
        return (
            <div>
                <p>Gotov pasus:</p>
                <div style={{fontSize: "1.6rem"}}>
                    <h2>
                        { props.pasus.podnaslov }
                    </h2>
                    <p style={{wordWrap: "break-word"}}>
                        { props.pasus.sadrzaj }
                    </p>
                </div>
            </div>
        );
    }

    function urediIliPregledajPasus(event: React.MouseEvent<HTMLButtonElement>)
    {
        /*treba da se sredi hardkodovanje dugmeta, al to moze i kasnije*/
        const { target: kliknutoDugme } = event;
        if(pasusSeUredjuje)
        {
            (kliknutoDugme as HTMLButtonElement).textContent = "Prikazi gotov pasus";
        }
        else
        {
            (kliknutoDugme as HTMLButtonElement).textContent = "Uredi pasus";
        }

        setPasusSeUredjuje((pasusSeUredjuje) => {
            return !pasusSeUredjuje;
        });
    }

    function ukloniPasus()
    {
        props.ukloniPasus(props.redniBroj);
    }

    function promenaUnosa(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void
    {
        const { name, value } = event.target;
        let noviPasus: PasusSadrzaj = {
            podnaslov: props.pasus.podnaslov,
            sadrzaj: props.pasus.sadrzaj
        };

        if(name === "podnaslov")
        {
            noviPasus.podnaslov = value;
        }

        if(name === "sadrzaj")
        {
            noviPasus.sadrzaj = value;
        }
        
        props.urediPasus && props.urediPasus(props.redniBroj, noviPasus.podnaslov, noviPasus.sadrzaj);
    }
}