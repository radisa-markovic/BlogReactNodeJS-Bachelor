import { useEffect, useState } from "react";
import { VRATI_DISLAJKOVANE_OBJAVE, VRATI_LAJKOVANE_OBJAVE, VRATI_MOJE_OBJAVE, VRATI_SVE_KORISNIKOVE_KOMENTARE } from "../../ApiPutanje";
import { Komentar } from "../../models/Komentar";
import { Korisnik } from "../../models/Korisnik";
import { Objava } from "../../models/Objava";
import { uputiPoziv } from "../../ServisneStvari";
import PregledObjave from "../blog/PostPreviewCard";

interface Props
{
    korisnik: Korisnik
}

interface KorisnikoviKomentari
{
    naslov: string,
    komentar: string
}

function Aktivnost(korisnik: Props): JSX.Element
{
    const [komentari, setKomentari] = useState<KorisnikoviKomentari[]>([]);
    const [lajkovaneObjave, setLajkovaneObjave] = useState<Objava[]>([]);
    const [dislajkovaneObjave, setDislajkovaneObjave] = useState<Objava[]>([]);
    const [mojeObjave, setMojeObjave] = useState<Objava[]>([]);

    /*============ SVI KORISNIKOVI KOMENTARI =============*/
    useEffect(() => {
        uputiPoziv(`${VRATI_SVE_KORISNIKOVE_KOMENTARE}/${korisnik.korisnik.korisnickoIme}`)
        .then((komentari) => {
            setKomentari(komentari);
        })
        .catch((greska) => {
            console.log(greska);
        })
    }, []);

    /*============ SVI LAJKOVANI POSTOVI =============*/
    useEffect(() => {
        uputiPoziv(`${VRATI_LAJKOVANE_OBJAVE}/${korisnik.korisnik.korisnickoIme}`)
        .then((lajkovaneObjave) => {
            setLajkovaneObjave(lajkovaneObjave);
        })
        .catch((greska) => {
            console.log(greska);
        })
    }, []);

    /*============ SVI DISLAJKOVANI POSTOVI =============*/
    useEffect(() => {
        uputiPoziv(`${VRATI_DISLAJKOVANE_OBJAVE}/${korisnik.korisnik.korisnickoIme}`)
        .then((dislajkovaneObjave) => {
            setDislajkovaneObjave(dislajkovaneObjave);
        })
        .catch((greska) => {
            console.log(greska);
        })
    }, []);

    /*============ MOJI POSTOVI =============*/
    useEffect(() => {
        uputiPoziv(`${VRATI_MOJE_OBJAVE}/${korisnik.korisnik.korisnickoIme}`)
        .then((mojeObjave) => {
            setMojeObjave(mojeObjave);
        })
        .catch((greska) => {
            console.log(greska);
        })
    }, []);

    return (
        <main className="container">
            <h1>Moja aktivnost</h1>
            <ul className="aktivnost__drzac-tabova">
                <li>
                    <label className="aktivnost__dugme" htmlFor="aktivnost-dugme--komentari">
                        Moji komentari
                    </label>
                </li>
                <li>
                    <label className="aktivnost__dugme" htmlFor="aktivnost-dugme--lajkovani-postovi">
                        Lajkovane objave
                    </label>
                </li>
                <li>
                    <label className="aktivnost__dugme" htmlFor="aktivnost-dugme--dislajkovani-postovi">
                        Dislajkovane objave
                    </label>
                </li>
                <li>
                    <label className="aktivnost__dugme" htmlFor="aktivnost-dugme--moje-objave">
                        Moje objave
                    </label>
                </li>
            </ul>
            
            <input type="radio" name="aktivnost-dugme" id="aktivnost-dugme--komentari" defaultChecked/>
            <section className="korisnikovi-komentari">
                <h2>Vaši komentari: </h2>
                <ul>
                    {/* { nacrtajKorisnikoveKomentare() } */}
                </ul>
            </section>
            
            <input type="radio" name="aktivnost-dugme" id="aktivnost-dugme--lajkovani-postovi" />
            <section className="lajkovani-postovi">
                <h2>Lajkovani postovi: </h2>
                <div className="objava__spisak">
                    {/* { nacrtajLajkovaneObjave() } */}
                </div>
            </section>
            
            <input type="radio" name="aktivnost-dugme" id="aktivnost-dugme--dislajkovani-postovi" />
            <section className="lajkovani-postovi">
                <h2>Dislajkovani postovi: </h2>
                {/* <div className="objava__spisak">
                    { nacrtajDislajkovaneObjave() }
                </div> */}
            </section>
            
            <input type="radio" name="aktivnost-dugme" id="aktivnost-dugme--moje-objave" />
            <section className="lajkovani-postovi">
                <h2>Moje objave: </h2>
                {/* <div className="objava__spisak">
                    { nacrtajKorisnikoveObjave() }
                </div> */}
            </section>
        </main>
    );

    // function nacrtajKorisnikoveKomentare(): JSX.Element[]
    // {
    //     return(
    //         komentari.map((komentar, indeks) => {
    //             return(
    //                 <li key={indeks}>
    //                     <h3>Naslov objave: <strong>{komentar.naslov}</strong></h3>
    //                     <p>
    //                         Vaš komentar: {komentar.komentar}
    //                     </p>
    //                 </li>)
    //         })
    //     );
    // }

    // function nacrtajLajkovaneObjave(): JSX.Element | JSX.Element[]
    // {
    //     if(lajkovaneObjave.length === 0)
    //         return (<p>Nema lajkovanih objava</p>);
    //     else
    //         return(
    //             lajkovaneObjave.map((lajkovanaObjava, indeks) => {
    //                 return <PregledObjave objava={lajkovanaObjava} 
    //                                       adminJePrijavljen={korisnik.korisnik.adminStatus}
    //                                       prijavljeniKorisnikNapisaoObjavu={lajkovanaObjava.korisnickoIme === korisnik.korisnik.korisnickoIme}/>
    //             })
    //         );
    // }

    // function nacrtajDislajkovaneObjave(): JSX.Element | JSX.Element[]
    // {
    //     if(dislajkovaneObjave.length === 0)
    //         return (<p>Nema dislajkovanih objava</p>);
    //     else
    //         return(
    //             dislajkovaneObjave.map((dislajkovanaObjava, indeks) => {
    //                 return <PregledObjave objava={dislajkovanaObjava} 
    //                                       adminJePrijavljen={korisnik.korisnik.adminStatus} 
    //                                       prijavljeniKorisnikNapisaoObjavu={dislajkovanaObjava.korisnickoIme === korisnik.korisnik.korisnickoIme}/>
    //             })
    //         );
    // }

    // function nacrtajKorisnikoveObjave(): JSX.Element | JSX.Element[]
    // {
    //     if(mojeObjave.length === 0)
    //         return (<p>Nema dislajkovanih objava</p>);
    //     else
    //         return(
    //             mojeObjave.map((mojaObjava, indeks) => {
    //                 return <PregledObjave objava={mojaObjava}
    //                                       adminJePrijavljen={korisnik.korisnik.adminStatus} 
    //                                       prijavljeniKorisnikNapisaoObjavu={true}/>
    //             })
    //         );
    // }
}

export default Aktivnost;