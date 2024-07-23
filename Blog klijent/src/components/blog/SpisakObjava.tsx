import React, { useEffect, useState } from "react";
import { OBJAVE_API, PRETRAZI_NASLOV_OBJAVE } from "../../ApiPutanje";
import { Objava } from "../../models/Objava";
import { Tag } from "../../models/Tag";
import Paginacija from "../blog-alatke/Paginacija";
import PretragaPoTagovima from "../blog-alatke/PretragaPoTagovima";
import UnosSaPredlozima from "../UnosSaPredlozima";
import PregledObjave from "./PregledObjave";

interface Props
{
    adminJePrijavljen: boolean,
    prijavljenoKorisnickoIme: string
}

function SpisakObjava(props: Props): JSX.Element
{
    const [objave, setObjave] = useState<Objava[]>([]);
    const [greska, setGreska] = useState<boolean>(false);
    const [podaciSeCekaju, setPodaciSeCekaju] = useState<boolean>(true);
    const [odabraniTag, setOdabraniTag] = useState<string>("");
    
    const [naslovObjave, setNaslovObjave] = useState("");
    const [najnovijePrvo, setNajnovijePrvo] = useState<boolean>(true);
    
    const [odabraniTagovi, setOdabraniTagovi] = useState<Tag[]>([]);
    const [iskljuceniTagovi, setIskljuceniTagovi] = useState<Tag[]>([]);

    useEffect(() => {
        const naziviTagovaUString = spojiNaziveTagovaUString();
        const naziviIskljucenihTagovaUString = spojiIskljuceneTagoveUString();

        let urlZaObjave = `${OBJAVE_API}/6/${0*6}/-/true/`;
        
        if(naziviTagovaUString !== "")
        {
            urlZaObjave += `?odabraniTagovi=${naziviTagovaUString}`;
        }
        
        if(naziviIskljucenihTagovaUString !== "")
        {
            urlZaObjave += `?iskljuceniTagovi=${naziviIskljucenihTagovaUString}`;
        }
        /*=========== ako nemam odabrane tagove ===========*/
        fetch(urlZaObjave)
        .then((odgovor: Response) => {
            if(!odgovor.ok)
                throw odgovor;

            return odgovor.json();
        })
        .then((objave) => {
            setObjave(objave);
        })
        .catch(greska => console.log(greska))
        .finally(() => {
            setPodaciSeCekaju(false);
        });

    }, [odabraniTagovi, iskljuceniTagovi]);

    return(
        <main className="container">
            { greska && <p>Greska neka baki</p> }
            { podaciSeCekaju && <p>Ucitavanje...</p>}
            <header>
                <h2>Pretraži objave:</h2>
                <div className="">
                    <UnosSaPredlozima onChangeHandler={promenaUnosa} 
                                      bindingPropertyName="naslov"
                                      setPropertyName={setNaslovObjave}
                                      urlPutanja={PRETRAZI_NASLOV_OBJAVE}
                                      placeholder="Unesi naslov objave"
                    />
                </div>
                <div>
                    <h2>Uredi objave po datumu:</h2>
                    <select name="objavePoDatumu" id="objavePoDatumu" onChange={(event) => sortirajObjavePoDatumu(event)}>
                        <option value="najnovijePrvo" selected>Najnovije prvo</option>
                        <option value="najstarijePrvo">Najstarije prvo</option>
                    </select>
                </div>
                <PretragaPoTagovima 
                    podesiTagoveZaFilter={setOdabraniTagovi} 
                    podesiTagoveZaIskljucenje={setIskljuceniTagovi}
                />
                { odabraniTag && prikaziObjavePodTagom(odabraniTag)}
            </header>
            {/*=========== OVDE SE ISCRTAVAJU POJEDINACNE OBJAVE ===========*/}
            <div className="objava__spisak">
                { nacrtajObjave() }
            </div>
            <Paginacija brojElemenataPoStranici={6}
                        urlZaPaginaciju={OBJAVE_API}
                        korisnickoIme=""
                        najnovijePrvo={najnovijePrvo}
                        postaviElemente={setObjave}
            />
        </main>
    );

    function sortirajObjavePoDatumu(event: React.ChangeEvent<HTMLSelectElement>)
    {
        console.log(event.target.value);
        const { value: odabranoSortiranje } = event.target;
        if(odabranoSortiranje === "najnovijePrvo")
        {
            setNajnovijePrvo(true);
        }
        else
        {
            setNajnovijePrvo(false);
        }
    }

    function nacrtajObjave(): JSX.Element | JSX.Element[]
    {       
        if(!podaciSeCekaju && objave.length === 0)
            return <p>Nema nijedne objave</p>;
        else
            return objave.map((objava, indeks) => {
                return <PregledObjave objava={objava} 
                                      adminJePrijavljen={props.adminJePrijavljen}
                                      key={indeks} 
                                      setObjave={setObjave}
                                      setOdabraniTag={setOdabraniTag}
                                      prijavljeniKorisnikNapisaoObjavu={objava.korisnickoIme === props.prijavljenoKorisnickoIme}
                        />
            });
    }

    function prikaziObjavePodTagom(odabraniTag: string): JSX.Element
    {
        return (
        <>
            <p>Odabran je tag: {odabraniTag}</p>
            <button onClick={ocistiTagove}>Očisti tag</button>
        </>
        );
    }

    function ocistiTagove()
    {
        setOdabraniTag("");
    }

    function promenaUnosa(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void
    {
        const { name, value } = event.target;
        setNaslovObjave(value);
    }

    function spojiNaziveTagovaUString(): string
    {
        return odabraniTagovi.map((tag) => tag.naziv).join();
    }

    function spojiIskljuceneTagoveUString(): string
    {
        return iskljuceniTagovi.map((iskljuceniTag) => iskljuceniTag.naziv).join();
    }
}

export default SpisakObjava;