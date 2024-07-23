import React, { FC } from "react";
import { Link } from "react-router-dom";
import { OBRISI_OBJAVU, VRATI_OBJAVE_POD_TAGOVIMA } from "../../ApiPutanje";
import { Objava } from "../../models/Objava";
import { uputiPoziv } from "../../ServisneStvari";

/*mozda imam jednu komponentu za objavu, i jedan boolean parametar koji kaze da ide kompaktan prikaz,
ili onaj ceo, videcu*/
interface Props
{
    objava: Objava,
    adminJePrijavljen: boolean,
    prijavljeniKorisnikNapisaoObjavu: boolean,
    setObjave?: React.Dispatch<React.SetStateAction<Objava[]>>,
    setOdabraniTag?: React.Dispatch<React.SetStateAction<string>>
}

const PregledObjave: FC<Props> = (props) => {
    
    const { 
        naslov, 
        kratakOpis,
        id_autora, 
        korisnickoIme,
        sadrzaj, 
        tagovi, 
        id,
        brojKomentara,
        brojLajkova,
        brojDislajkova,
        URLNaslovneSlike,
        datumPisanja
    } = props.objava;

    return(
        <article className="objava__pregled donja-margina-potomci">
            { 
                props.prijavljeniKorisnikNapisaoObjavu &&
                nacrtajKomandeZaPrijavljenogKorisnika()
            }
            { props.adminJePrijavljen && nacrtajAdminoveKontrole() }
            <div className="drzac-slike">
                <img src={URLNaslovneSlike} 
                        alt="" 
                        width={245}
                        height={245}
                        loading="lazy"
                />
            </div>
            <header className="objava__header container">
                <h2 className="objava__naslov">
                    <Link to={`/objava/${id}`} className="objava__procitaj-celu">
                        { naslov }
                    </Link>
                </h2>
                <time className="objava__datum-pisanja">
                    { datumPisanja }
                </time>
                <p className="objava__kratak-opis">
                    { kratakOpis }
                </p>
                <h3 className="objava__autor">
                    <i>Napisao:</i>&nbsp;
                    <Link to={`/objaveKorisnika/${korisnickoIme}`} 
                        className="link-za-korisnicku-stranicu"
                    >
                        { korisnickoIme }
                    </Link>
                </h3>
            </header>
            {/* <Link to={`/objava/${id}`} className="objava__procitaj-celu">
                Pročitaj celu objavu
            </Link> */}
            <ul className="objava__reakcije">
                <li className="objava__reakcija-holder">
                    <i className="fas fa-thumbs-up"></i>
                    { brojLajkova? brojLajkova : 0 }
                </li>
                <li className="objava__reakcija-holder">
                    <i className="fas fa-thumbs-down"></i>
                    { brojDislajkova? brojDislajkova : 0 }
                </li>
                <li className="objava__reakcija-holder">
                    <i className="fas fa-comment"></i>
                    { brojKomentara? brojKomentara : 0  }
                </li>
            </ul>
            {/* <p>
                <i className="fas fa-comment"></i>
                Broj komentara: { brojKomentara? brojKomentara : 0  }
            </p>
            <p>Broj lajkova: { brojLajkova? brojLajkova : 0 }</p>
            <p>Broj dislajkova: { brojDislajkova? brojDislajkova : 0 }</p> */}
            <nav className="objava__tagovi">
                { tagovi && nacrtajTagove() }
            </nav>
        </article>       
    );

    function nacrtajTagove(): JSX.Element[]
    {/*====== jedino treba da se vidi dal se ovde stavlja button, ili neki Link
        koji posle prevezujem u App.tsx pod Route komponentama ======*/
        const tagoviObjave: JSX.Element[] = tagovi.map((tag, indeks) => {
            return <button data-to={`/objaveSaTagom/${tag.naziv}`} 
                         className="objava__tag"
                         onClick={(event) => ucitajObjavePodTagom(event)}
                   ># {tag.naziv}</button>
        });

        return tagoviObjave;
    }

    function ucitajObjavePodTagom(event: React.MouseEvent<HTMLButtonElement>)
    {
        const tekstUTagu = (event.currentTarget.textContent)!.substring(2);
        console.log(tekstUTagu);
        uputiPoziv(`${VRATI_OBJAVE_POD_TAGOVIMA}/${tekstUTagu}`)
        .then((podaci) => {
            props.setObjave && props.setObjave(podaci);
            props.setOdabraniTag && props.setOdabraniTag(tekstUTagu);
        })
        .catch((greska) => {
            console.log(greska);
        });
    }

    function nacrtajAdminoveKontrole(): JSX.Element | JSX.Element[]
    {
        return(
            <div className="admin__kontrola-objava">
                <button onClick={() => obrisiObjavu()} className="admin__obrisi-objavu">
                    Obriši
                </button>
            </div>
        );
    }

    function obrisiObjavu()
    {
        console.log(id);

        fetch(`${OBRISI_OBJAVU}/${id}`, {
            method: "DELETE", // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        .then((odgovor) => {
            if(odgovor.ok)
            {
                if(props.setObjave)
                {
                    props.setObjave((objave) => {
                        return objave.filter((objava) => objava.id !== id);
                    });
                }
                alert("Uspešno obrisana objava");
            }
            else 
            {
                throw new Error("Neuspelo brisanje objave");
            }
        })
        .catch((greska) => {
            alert("Neuspelo brisanje");
            console.log(greska);
        });        
    }

    function nacrtajKomandeZaPrijavljenogKorisnika(): JSX.Element
    {
        return(
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Link to={`/napisiObjavu/${props.objava.id}`}
                      className="uredi__objavu"
                >
                    Uredi objavu
                </Link>
                <button onClick={obrisiObjavu} className="admin__obrisi-objavu">
                    Obriši kao admin
                </button>
            </div>
        );
    }
}

export default PregledObjave;