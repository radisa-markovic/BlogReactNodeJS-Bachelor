import React, { useEffect, useState } from "react";

interface Props
{
    urlZaPaginaciju: string,
    brojElemenataPoStranici: number,
    korisnickoIme: string,
    najnovijePrvo: boolean,
    postaviElemente: Function,
}

export default function Paginacija(props: Props): JSX.Element
{
    const [trenutnaStranica, setTrenutnaStranica] = useState<number>(0);/*odnosno prva*/
    const [ukupnoElemenata, setUkupnoElemenata] = useState<number>(0);

    useEffect(() => {
         /*===== 
            ako je korisnicko ime = "-", onda ne trazim objave za specificnog korisnika,
            vec sve objave iz baze
        =====*/
        fetch(`${props.urlZaPaginaciju}/${props.brojElemenataPoStranici}/${trenutnaStranica * props.brojElemenataPoStranici}` + `${props.korisnickoIme === ""? "/-" : "/" + props.korisnickoIme }` + `/${props.najnovijePrvo}`)
        .then((odgovor) => {
            return odgovor.json();
        })
        .then((objave) => {
            setUkupnoElemenata(objave[0].brojObjava);
            console.log(objave);
            props.postaviElemente(objave);
        })
        .catch((greska) => {
            console.log(greska);
        })
    }, [trenutnaStranica, props.najnovijePrvo]);

    return (
        <ul className="paginacija__lista">
            { prikaziDugmiceZaStranice() }
        </ul>
    );

    function prikaziDugmiceZaStranice(): JSX.Element[]
    {
        console.log(ukupnoElemenata);
        const brojStranica = ukupnoElemenata / props.brojElemenataPoStranici;
        let dugmiciZaStranice: JSX.Element[] = [];
        for(let i=0; i < brojStranica; i++)
        {
            const dugmeHolder = (
                <li>
                    <input type="radio"
                           id={"paginacija__dugme--" + i}
                           onChange={(event) => promeniStranicu(event)}
                           data-rednibrojstranice={i}
                           style={{display: "none"}}
                           name="paginacijaDugme"
                           value={i}
                           checked={ i === trenutnaStranica ? true : false }
                    />
                    <label htmlFor={"paginacija__dugme--" + i}
                           className="paginacija__dugme"
                    >
                        { i + 1 }
                    </label>
                </li>);
            
            dugmiciZaStranice.push(dugmeHolder);
        }
        
        return dugmiciZaStranice;
    }

    function promeniStranicu(event: React.ChangeEvent<HTMLInputElement>)
    {
        const { target: kliknutiBrojStranice } = event
        const redniBrojStranice = kliknutiBrojStranice.dataset.rednibrojstranice;
        console.log(redniBrojStranice);
        setTrenutnaStranica(parseInt(redniBrojStranice!));
    }
}