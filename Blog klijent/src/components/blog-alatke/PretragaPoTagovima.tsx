import React, { useEffect, useState } from "react";
import { UCITAJ_TAGOVE_ZA_PRETRAGU } from "../../ApiPutanje";
import { Tag } from "../../models/Tag";
import { uputiPoziv } from "../../ServisneStvari";

interface Props
{
    podesiTagoveZaFilter: React.Dispatch<React.SetStateAction<Tag[]>>,
    podesiTagoveZaIskljucenje: React.Dispatch<React.SetStateAction<Tag[]>>
}

export default function PretragaPoTagovima(props: Props): JSX.Element
{
    const [tagovi, setTagovi] = useState<Tag[]>([]);
    const [pretraga, setPretraga] = useState<string>("");
    const [odabraniTagovi, setOdabraniTagovi] = useState<Tag[]>([]);
    const [iskljuceniTagovi, setIskljuceniTagovi] = useState<Tag[]>([]);

    useEffect(() => {
        ucitajTagoveZaPretragu()
    }, []);

    /*==== DROPDOWN ====*/
    useEffect(() => {
        const activeDropdown = document.querySelector(".ponudjeni-tagovi-drzac.active");

        document.body.addEventListener("click", (event) => {
            const { target } = event;
            
            if((target as HTMLElement).id === "unosZaTag")
            {
                if((target as HTMLElement).classList.contains("active"))
                {
                    return;
                }
                else
                {
                    (target as HTMLElement).classList.add("active");
                    return;
                }
            }   

            if((target as HTMLElement).classList.contains("dugme-odabir-taga") || (target as HTMLElement).classList.contains("radio-simbol"))
            {
                return;
            } 

            const unosZaTag = document.getElementById("unosZaTag");
            unosZaTag && unosZaTag.classList.remove("active");
        });
    }, []);

    return(
        <div className="ponudjeni-tagovi-drzac">
            <h2>Pretraži po tagovima</h2>
            <div>
                <p>Odabrani tagovi</p>
                <ul className="odabrani-tagovi">
                    { nacrtajOdabraneTagove() }
                </ul>
            </div>
            <div>
                <p>Iskljuceni tagovi</p>
                <ul className="odabrani-tagovi">
                    { nacrtajIskljuceneTagove() }
                </ul>
            </div>
            <input type="text" 
                   name="unosZaTag" 
                   className="kontrola" 
                   id="unosZaTag" 
                   placeholder="Unesi Tag"
                   onChange={(event) => pretraziTagove(event)}
            />
            <ul className="ponudjeni-tagovi">
                { nacrtajPonudjeneTagove() }
            </ul>
        </div>
    );

    function nacrtajPonudjeneTagove(): JSX.Element[]
    {
        return tagovi.filter((tag) => {
            if(pretraga === "")
            {
                return tag;
            }
            
            if(tag.naziv.toLowerCase().includes(pretraga.toLowerCase()))
            {
                return tag;
            }
        }).map((tag, indeks) => {
            return(
                <li className="ponudjeni-tag" 
                    data-naziv_taga={tag.naziv} 
                    data-id_taga={tag.id} 
                >
                    <input type="checkbox" 
                           name={`odabirTaga-${indeks}`} 
                           id={`odabirTaga-${indeks}-ukljuci`} 
                           className="dugme-odabir-taga"
                           onChange={(event) => { odaberiTag(event) }}    
                    />
                    <label htmlFor={`odabirTaga-${indeks}-ukljuci`} className="radio-labela">
                        <i className="fa-solid fa-circle-check radio-simbol"></i>
                    </label>
                    <input type="checkbox" 
                           name={`iskljuciTag-${indeks}`} 
                           id={`iskljuciTag-${indeks}-iskljuci`} 
                           className="dugme-odabir-taga"
                           onChange={(event) => { iskljuciTag(event) }}    
                    />
                    <label htmlFor={`iskljuciTag-${indeks}-iskljuci`} className="radio-labela">
                        <i className="fa-solid fa-circle-check radio-simbol"></i>gasi
                    </label>
                    {tag.naziv}
                </li>
            )
        });
    }

    function nacrtajOdabraneTagove(): JSX.Element[]
    {
        return odabraniTagovi.map(tag => {
            return (
                <li>
                    {tag.naziv} <button onClick={(event) => ukloniElement(event)} data-naziv_taga={tag.naziv} data-id__taga={tag.id}>&times;</button>
                </li>
            )
        });
    }

    function nacrtajIskljuceneTagove(): JSX.Element[]
    {
        return iskljuceniTagovi.map(tag => {
            return (
                <li>
                    {tag.naziv} <button onClick={(event) => ukloniIskljuceniTag(event)} data-naziv_taga={tag.naziv} data-id__taga={tag.id}>&times;</button>
                </li>
            )
        });
    }

    function odaberiTag(event: React.ChangeEvent<HTMLInputElement>)
    {
        const { target: cekiranoDugme } = event;
        const cekiraniTag: Tag = vratiCekiraniTag(cekiranoDugme);
        
        let noviOdabraniTagovi: Tag[] = [];
        if(cekiranoDugme.checked)
        {
            setTagovi((tagovi) => tagovi.filter((tag) => tag.naziv !== cekiraniTag.naziv));
            noviOdabraniTagovi = [...odabraniTagovi, cekiraniTag]
            setOdabraniTagovi(noviOdabraniTagovi);
        }
        //@ts-ignore
        props.podesiTagoveZaFilter(noviOdabraniTagovi);
    }

    function iskljuciTag(event: React.ChangeEvent<HTMLInputElement>)
    {
        const { target: cekiranoDugme } = event;
        const cekiraniTag: Tag = vratiCekiraniTag(cekiranoDugme);

        let noviIskljuceniTagovi: Tag[] = [];
        if(cekiranoDugme.checked)
        {
            setTagovi((tagovi) => tagovi.filter((tag) => tag.naziv !== cekiraniTag.naziv));
            noviIskljuceniTagovi = [...iskljuceniTagovi, cekiraniTag];
            setIskljuceniTagovi(noviIskljuceniTagovi);
        }

        props.podesiTagoveZaIskljucenje(noviIskljuceniTagovi);
    }

    function vratiCekiraniTag(cekiranoDugme: HTMLInputElement): Tag
    {
        const nazivTaga = cekiranoDugme.closest(".ponudjeni-tag")!.getAttribute("data-naziv_taga");
        const idTaga = cekiranoDugme.closest(".ponudjeni-tag")!.getAttribute("data-id_taga");

        return {
            id: parseInt(idTaga!),
            naziv: nazivTaga!
        };        
    }

    function vratiKliknutiTagZaUklanjanje(kliknutoDugme: HTMLButtonElement): Tag
    {
        const nazivTaga = (kliknutoDugme as HTMLButtonElement).getAttribute("data-naziv_taga");
        const idTaga = (kliknutoDugme as HTMLButtonElement).getAttribute("data-id_taga");

        return {
            id: parseInt(idTaga!),
            naziv: nazivTaga!
        };
    }

    function ukloniElement(event: React.MouseEvent<HTMLButtonElement>)
    {
        const { target: kliknutoDugme } = event;
        const tagSaUpotrebomKojiSeVraca: Tag = vratiKliknutiTagZaUklanjanje(kliknutoDugme as HTMLButtonElement);

        const noviOdabraniTagovi = odabraniTagovi.filter((odabraniTag) => odabraniTag.naziv !== tagSaUpotrebomKojiSeVraca.naziv); 
        setOdabraniTagovi(noviOdabraniTagovi);
        setTagovi([...tagovi, tagSaUpotrebomKojiSeVraca]);
        //@ts-ignore
        props.podesiTagoveZaFilter(noviOdabraniTagovi);
    }

    function ukloniIskljuceniTag(event: React.MouseEvent<HTMLButtonElement>)
    {
        const { target: kliknutoDugme } = event;
        const tagSaUpotrebomKojiSeVraca: Tag = vratiKliknutiTagZaUklanjanje(kliknutoDugme as HTMLButtonElement);

        const noviIskljuceniTagovi = iskljuceniTagovi.filter((iskljuceniTag) => iskljuceniTag.naziv !== tagSaUpotrebomKojiSeVraca.naziv); 
        setIskljuceniTagovi(noviIskljuceniTagovi);
        setTagovi([...tagovi, tagSaUpotrebomKojiSeVraca]);
        //@ts-ignore
        props.podesiTagoveZaIskljucenje(noviIskljuceniTagovi);
    }

    function pretraziTagove(event: React.ChangeEvent<HTMLInputElement>)
    {
        setPretraga(event.target.value);
    }

    function ucitajTagoveZaPretragu()
    {
        uputiPoziv(UCITAJ_TAGOVE_ZA_PRETRAGU)
            .then((tagovi) => {
                setTagovi(tagovi);
            })
            .catch((greska) => {
                console.log(greska);
            });
    }
}