import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { OBJAVE_API, URL_NASLOVNA_SLIKA, URL_PROFILNA_SLIKA, URL_ZA_KORISNICKE_SLIKE, VRATI_MOJE_OBJAVE } from "../../ApiPutanje";
import { Korisnik } from "../../models/Korisnik";
import { Objava } from "../../models/Objava";
import { uputiPoziv } from "../../ServisneStvari";
import NoviUnosSlike from "../blog-alatke/NoviUnosSlike";
import Paginacija from "../blog-alatke/Paginacija";
import PregledObjave from "../blog/PregledObjave";
import SpisakObjava from "../blog/SpisakObjava";

interface Props
{
    adminJePrijavljen: boolean;
    korisnik: Korisnik
}

/*===== 
    UBACITI KORISNICKU SLIKU I NASLOVNU:
    1. dve nove kolone u tabeli korisnici
    2. upload ide u ono skladiste u bazi
    3. ovde ce ide useEffect koji bira te dve kolone iz baze "korisnici",
    i ako nema slika, ce pise "dodaj sliku", al ako je taj korisnik prijavljen,
    inace, isto ako je prijavljen, moze ici "zameni sliku", koja radi PATCH ili PUT
    4. potvrda nek ide na klik dugmeta

    5. podeliti tabelu za profilnu i naslovnu sliku na dve zasebne, tako je lakse, posle se samo spajaju
=====*/

export default function KorisnickaStanica(props: Props): JSX.Element
{
    const [sopstveneObjave, setSopstveneObjave] = useState<Objava[]>([]);
    const { korisnickoIme } = useParams<{korisnickoIme: string}>();

    const [naslovnaSlika, setNaslovnaSlika] = useState<File | null>(null);
    const [putanjaDoNaslovneSlike, setPutanjaDoNaslovneSlike] = useState<string>("http://localhost:3002/images/CoverImagePlaceholder.png");

    const [profilnaSlika, setProfilnaSlika] = useState<File | null>(null);
    const [putanjaDoProfilneSlike, setPutanjaDoProfilneSlike] = useState<string>("http://localhost:3002/images/ProfileImagePlaceholder.jpg");


    /*======= UCITAVANJE KORISNIKOVIH OBJAVA =======*/
    useEffect(() => {
        uputiPoziv(`${OBJAVE_API}/${6}/${1}/${korisnickoIme}`)
        .then((sopstveneObjave) => {
            setSopstveneObjave(sopstveneObjave);
        })
        .catch((greska) => {
            console.log(greska);
        })
    }, []);

    /*======= UCITAVANJE KORISNIKOVIH PROFILNIH I NASLOVNIH SLIKA =======*/
    useEffect(() => {
        uputiPoziv(`${URL_ZA_KORISNICKE_SLIKE}/${korisnickoIme}`)
        .then((odgovor) => {
            if(odgovor.urlNaslovneSlike)
            {
                setPutanjaDoNaslovneSlike(odgovor.urlNaslovneSlike);
            }

            if(odgovor.urlProfilneSlike)
            {
                setPutanjaDoProfilneSlike(odgovor.urlProfilneSlike);
            }
        })
        .catch((greska) => {
            console.error(greska);
        });
    }, []);

    return(
        <main className="container">
            <header className="korisnik__zaglavlje">
                <div className="korisnik__naslovna-slika-holder">
                    <img src={naslovnaSlika? URL.createObjectURL(naslovnaSlika) : putanjaDoNaslovneSlike} 
                         alt="naslovna slika" 
                         className="korisnik__naslovna-slika" 
                         height={200}
                    />
                </div>
                { 
                    stranicaJePrijavljenogKorisnika() && 
                    // nacrtajFormuZaPromenuNaslovneSlike() 
                    <NoviUnosSlike idKorisnika={props.korisnik.id}
                                   tipKorisnickeSlike="naslovna"
                                   putanjaDoStareSlike={putanjaDoNaslovneSlike}
                                   postaviSliku={setNaslovnaSlika}
                    />
                }
                
                <div className="korisnik__profilna-slika-holder">
                    <img src={profilnaSlika? URL.createObjectURL(profilnaSlika) : putanjaDoProfilneSlike} 
                         alt="profilna slika" 
                         className="korisnik__profilna-slika" 
                    />
                </div>
                { 
                    stranicaJePrijavljenogKorisnika() && 
                    // nacrtajFormuZaPromenuProfilneSlike() 
                    <NoviUnosSlike idKorisnika={props.korisnik.id}
                                   tipKorisnickeSlike="profilna"
                                   putanjaDoStareSlike={putanjaDoProfilneSlike}
                                   postaviSliku={setProfilnaSlika}
                    />
                }
                <h1 className="korisnik__naslov">
                    Objave korisnika: {korisnickoIme}
                </h1>
            </header>
            {/* <div className="objava__spisak">
                { nacrtajSopstveneObjave() }
            </div> */}
            <Paginacija urlZaPaginaciju={OBJAVE_API} 
                        brojElemenataPoStranici={6} 
                        korisnickoIme={korisnickoIme}
                        postaviElemente={setSopstveneObjave}
                        najnovijePrvo={true}
            />
        </main>
    );

    function stranicaJePrijavljenogKorisnika(): boolean
    {
        return props.korisnik.korisnickoIme === korisnickoIme;//ovo desno je iz putanje
    }

    // function nacrtajSopstveneObjave(): JSX.Element | JSX.Element[]
    // {
    //     if(sopstveneObjave.length === 0)
    //         return (<p>Nema dislajkovanih objava</p>);
    //     else
    //         return(
    //             sopstveneObjave.map((mojaObjava, indeks) => {
    //                 return <PregledObjave objava={mojaObjava} 
    //                         adminJePrijavljen={props.adminJePrijavljen}
    //                         prijavljeniKorisnikNapisaoObjavu={mojaObjava.korisnickoIme === props.korisnik.korisnickoIme} />
    //             })
    //         );
    
    // }
}