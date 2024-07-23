import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { Link } from "react-router-dom";
import { DISLAJKUJ_OBJAVU, JEDNA_OBJAVA, LAJKUJ_OBJAVU, OBJAVE_API, OBRISI_KOMENTAR, OBRISI_OBJAVU, REAGUJ_NA_OBJAVU, VRATI_REAKCIJE_NA_OBJAVU } from "../../ApiPutanje";
import useFetch from "../../customHooks/useFetch";
import { Komentar } from "../../models/Komentar";
import { Korisnik } from "../../models/Korisnik";
import { Objava } from "../../models/Objava";
import { upakujZahtev, uputiPoziv } from "../../ServisneStvari";
import parse from 'html-react-parser';
import Preporuke from "./Preporuke";
import { TipoviPreporuka } from "../../models/TipoviPreporuka";

interface PunaObjavaProps
{
    prijavljeniKorisnik: Korisnik,
    // setObjava: Function
}

export function PunaObjava(props: PunaObjavaProps): JSX.Element
{
    const [objava, setObjava] = useState<Objava>({
        URLNaslovneSlike: "",
        brojKomentara: 0,
        brojLajkova: 0,
        brojDislajkova: 0,
        datumPisanja: "",
        id: -1,
        id_autora: -1,
        komentari: [],
        korisnickoIme: "",
        kratakOpis: "",
        naslov: "",
        sadrzaj: "",
        tagovi: []
    });
    const [greska, setGreska] = useState<boolean>(false);
    const [podaciSeCekaju, setPodaciSeCekaju] = useState<boolean>(true);
    const [komentar, setKomentar] = useState("");
    const [kodReakcije, setKodReakcije] = useState<number>(-1);
    const [lajkovi, setLajkovi] = useState(0);
    const [dislajkovi, setDislajkovi] = useState(0);

    const [urloviSlika, setUrloveSlika] = useState<string[]>([]);

    const { id } = useParams<{id: string}>();
    
    const history = useHistory();

    /*======== HVATANJE OBJAVE IZ BAZE =========*/
    useEffect(() => {
        fetch(`${JEDNA_OBJAVA}/${id}`)
        .then((odgovor: Response) => {
            if(!odgovor.ok)
                throw odgovor;

            return odgovor.json();
        })
        .then((objava: Objava) => {
            setObjava(objava);
        })
        .catch((greska) => {
            console.log(greska);
        })
        .finally(() => {
            setPodaciSeCekaju(false);
        })
    }, [id]);

    /*========== UCITAVANJE SLIKA ==============*/
    // useEffect(() => {
    //     /*sad hvatam sve slike iz baze preko documeent.uerySSelectorAll, 
    //         pa onda popunjavam sa onim sto sam izvukao iz baze 
    //         */
    //     fetch(`http://localhost:3002/slikeSaObjave/${id}`)
    //     .then((odgovor: Response) => {
    //         if(!odgovor.ok)
    //             throw odgovor;

    //         return odgovor.json();
    //     })
    //     .then((urloviSlika: any[]) => {
    //         const objavaHolder = document.querySelector(".objava__cela");
    //         const sveSlike = objavaHolder!.querySelectorAll("img");
    //         console.log(urloviSlika);
    //         // let slikeURikverc = urloviSlika.reverse();
    //         for(let i = 0; i < sveSlike.length - 1; i++)
    //             sveSlike[i+1].src = urloviSlika[i].urlSlike;
    //     })
    //     .catch((greska) => {
    //         console.log(greska);
    //     });
    // }, [objava]);
    /*======== PROVERA STATUSA LAJKA/DISLAJKA PRIJAVLJENOG (ILI POSMATRACA AKO GA NEMA) KORISNIKA =========*/
    useEffect(() => {
        if(props.prijavljeniKorisnik.korisnickoIme)
        {
            const objekatZahteva = upakujZahtev("POST", {
                idKorisnika: props.prijavljeniKorisnik.id
            });
    
            uputiPoziv(`${VRATI_REAKCIJE_NA_OBJAVU}/${id}`, objekatZahteva)
            .then((odgovor) => {
                const korisnikovaReakcija = odgovor.lajk.data[0];
                if(korisnikovaReakcija === 1)
                {
                    // alert("Korisnik je lajkovao, pa ne moze da radi nista, i setujem zelno za lajk");
                    setKodReakcije(1);
                }
                else
                    if(korisnikovaReakcija === 0)
                    {
                        // alert("Korisnik je dislajkovao, pa ne moze da radi nista, i setujem crveno za dislajk");
                        setKodReakcije(0);
                    }
            })
            .catch((greska) => {
                console.log(greska);
                if(greska.status === 400)
                {
                    // alert("Korisnik nije reagovao na objavu, pa mu rade lajk i dislajk");
                    setKodReakcije(-1);
                }
            });
        }

    }, [props.prijavljeniKorisnik.korisnickoIme]);

    return (
        <main className="objava__holder container">
            {/* <button className="objava__idi-nazad" 
                    onClick={vratiSeNazad}
            >
                { <span className="strelica"></span> }
                &larr;
            </button> */}
            { 
                (props.prijavljeniKorisnik.adminStatus ||
                 props.prijavljeniKorisnik.korisnickoIme === objava.korisnickoIme
                ) && 
                nacrtajAdminoveKontrole() 
            }
            <div>
                { podaciSeCekaju && <p>Ucitavanje...</p> }
                { greska && console.log(greska) }
                { objava && nacrtajObjavu() }
            </div>
            <Preporuke vrstaPreporuke={TipoviPreporuka.NAJKOMENTARISANIJI} 
                       preporukaUVrsti={1}
                       prijavljenoKorisnickoIme={objava.korisnickoIme}                       
            />
        </main>
    );

    function nacrtajObjavu(): JSX.Element
    {
        return (
            <>
                <article className="objava__cela">
                    <div>
                        <img src={objava?.URLNaslovneSlike} alt="" />
                    </div>
                    <h1 className="objava__naslov">
                        { objava && objava.naslov }
                    </h1>
                    <nav className="objava__tagovi">
                        { objava!.tagovi && nacrtajTagove() }
                    </nav>
                    <p className="objava__autor">
                        { objava && objava.id_autora }
                        { objava && objava.korisnickoIme }
                    </p>
                    <div className="objava__odnos-reakcija">
                        { objava && nacrtajOdnosReakcija() }
                    </div>
                    { nacrtajOdeljakZaReakciju() }
                    {/* <p className="objava__sadrzaj"> */}
                    { objava && parse(objava.sadrzaj) }
                    {/* </p> */}
                </article>
                { props.prijavljeniKorisnik.korisnickoIme && nacrtajUnosKomentara() }
                <section className="objava__odeljak-komentara">
                    <h2>Komentari</h2>
                    <ul className="objava__komentari">
                        { objava.komentari? nacrtajKomentare(): <p>Nema komentara</p> }
                    </ul>
                </section>
            </>
        );
    }

    function nacrtajTagove(): JSX.Element[]
    {        
        const tagoviObjave: JSX.Element[] = objava!.tagovi.map((tag, indeks) => {
            return <Link to="#" className="objava__tag"># {tag.naziv}</Link>
        });

        return tagoviObjave;
    }

    function nacrtajAdminoveKontrole(): JSX.Element | JSX.Element[]
    {
        return (
            <div className="admin__kontrola-objava">
                <Link to={`/napisiObjavu/${id}`}
                      className="uredi__objavu"
                >
                    Uredi objavu
                </Link>
                <button onClick={() => obrisiObjavu()} className="admin__obrisi-objavu">
                    Obriši
                </button>
            </div>
        );
    } 

    function obrisiObjavu()
    {
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
                alert("Uspesno obrisana objava");
                history.push("/sveObjave");
            }
            else
            {
                throw new Error("Neuspelo brisanje objave");
            }
        }).catch((greska) => {
            alert("Greska prilikom brisanja objaave");
            console.log(greska);
        });
    }

    function hendlujUnosKomentara(event: React.ChangeEvent<HTMLTextAreaElement>)
    {
        setKomentar(event.target.value);
    }

    function nacrtajOdnosReakcija(): JSX.Element
    {
        return(
            <>
                <p>
                    <i className="fas fa-thumbs-up" style={{fontSize: '3rem', color: kodReakcije === 1 ? 'green': 'initial'}}></i>
                    <b style={{color:"green"}}>{objava!.brojLajkova}</b> 
                </p> <br />
                <p>
                    <i className="fas fa-thumbs-down" style={{fontSize: '3rem', color: kodReakcije === 0 ? 'red': 'initial'}}></i> 
                    <b style={{color:"red"}}>{objava!.brojDislajkova}</b> 
                </p>
            </>
        );
    }

    function nacrtajOdeljakZaReakciju(): JSX.Element
    {
        if(props.prijavljeniKorisnik.korisnickoIme === "")
            return (<></>);
        else
            return(
                <div>
                    <button onClick={() => lajkujObjavu()}
                            style={{marginRight: "2rem"}}
                    >
                        { kodReakcije === 1? 'Ukloni lajk': 'Lajkuj' }
                    </button>
                    <button onClick={() => dislajkujObjavu()}>
                       { kodReakcije === 0? 'Ukloni dislajk' : 'Dislajkuj' }
                    </button>
                </div>
            );
    }

    function lajkujObjavu()
    {
        const objekatZahteva = upakujZahtev("POST", {
            idKorisnika: props.prijavljeniKorisnik.id,
            idObjave: parseInt(id),
            reakcija: 1
        });
        /*== 1 je lajk*/

        uputiPoziv(`${REAGUJ_NA_OBJAVU}/${id}`, objekatZahteva)
        .then((odgovor) => {
            //drugi klik na lajk
            if(kodReakcije === 1)
            {
                setKodReakcije(-1);
                setObjava((objava) => {
                    return {
                        ...objava,
                        brojLajkova: objava.brojLajkova - 1
                    };
                });
                // alert("Dislajkovana objava");
            }
            else
            {
                //lajk pa dislajk ("toggle")
                if(kodReakcije === 0)
                {
                    setKodReakcije(1);
                    setObjava((objava) => {
                        return {
                            ...objava,
                            brojLajkova: objava.brojLajkova + 1,
                            brojDislajkova: objava.brojDislajkova - 1
                        };
                    });

                }
                else
                {
                    //prva reakcija
                    if(kodReakcije === -1)
                    {
                        setKodReakcije(1);
                        setObjava((objava) => {
                            return {
                                ...objava,
                                brojLajkova: objava.brojLajkova + 1,
                            }
                        });
                        // alert("Prvi lajk");
                    }
                }
                // alert("Lajkovana objava");
            }
        })
        .catch((greska) => {
            console.log(greska);
        });
    }

    function dislajkujObjavu()
    {
        const objekatZahteva = upakujZahtev("POST", {
            idKorisnika: props.prijavljeniKorisnik.id,
            idObjave:parseInt(id),
            reakcija: 0
        });

        uputiPoziv(`${REAGUJ_NA_OBJAVU}/${id}`, objekatZahteva)
        .then((odgovor) => {
            console.log(kodReakcije);
            //cancel na svaki drugi klik
            if(kodReakcije === 0)
            {
                setKodReakcije(-1);
                setObjava((objava) => {
                    return {
                        ...objava,
                        brojDislajkova: objava.brojDislajkova - 1
                    }
                });
                // alert("Uklonjen dislajk");
            }
            else
            {
                //imam lajk, pa saljem dislajk ("toggle")
                if(kodReakcije === 1)
                {
                    setKodReakcije(0);
                    setObjava((objava) => {
                        return {
                            ...objava,
                            brojDislajkova: objava.brojDislajkova + 1,
                            brojLajkova: objava.brojLajkova - 1
                        }
                    });
                    // alert("Dislajkovana objava");
                }
                else
                {
                    //prva reakcija
                    if(kodReakcije === -1)
                    {
                        setKodReakcije(0);
                        setObjava((objava) => {
                            return {
                                ...objava,
                                brojDislajkova: objava.brojDislajkova + 1,
                            }
                        });
                        // alert("Prvi dislajk");
                    }
                }
            }
            
            
            // setDislajkovi(() => dislajkovi + 1);
        })
        .catch((greska) => {
            console.log(greska);
        });
    }

    function potvrdiKomentar()
    {
        const komentarObjekat: Partial<Komentar> = {
            idObjave: parseInt(id),
            idAutora: props.prijavljeniKorisnik.id,
            sadrzaj: komentar
        };

        /*bogdanova fora, 337. linija*/
        const noviNiz = objava.komentari;
        // noviNiz.push(komentarObjekat as Komentar)

        uputiPoziv(`http://localhost:3002/dodajKomentar`, upakujZahtev("POST", komentarObjekat))
        .then((odgovor) => {
            alert("Uspesno unet komentar");
            komentarObjekat.korisnickoIme = props.prijavljeniKorisnik.korisnickoIme;
            noviNiz.push(komentarObjekat as Komentar)
            setObjava((objava) => {
                return {
                    ...objava,
                    // komentari: noviNiz
                }
            });
            // history.push("/sveObjave");
            // setKomentar();
        })
        .catch((greska) => {
            console.log(greska);
        });
    }

    function vratiSeNazad()
    {
        history.go(-1);
    }

    function nacrtajUnosKomentara(): JSX.Element
    {
        return (
            <div className="objava__napisi-komentar-holder">
                <textarea placeholder="Napiši komentar"
                            className="kontrola objava__unos-komentara" 
                            name="korisnikovKomentar"     
                            onChange={hendlujUnosKomentara}  
                />
                <button className="objava__dugme"
                        onClick={potvrdiKomentar}
                >
                    Potvrdi komentar
                </button>
            </div>
        );
    }

    function nacrtajKomentare(): JSX.Element[]
    {
        console.log(objava.komentari);
        const komentari = objava.komentari.map((komentar, indeks) => {
            return(
            <li className="objava__komentar-kontejner" data-idkomentara={komentar.idKomentara}>
                { props.prijavljeniKorisnik.adminStatus && nacrtajBrisanjeKomentara()}
                { komentar.sadrzaj } <br/>
                Napisao: { komentar.korisnickoIme }
                <hr/>
            </li>
            );
        });

        return komentari;
    }

    function nacrtajBrisanjeKomentara()
    {
        return (
            <button onClick={(event) => obrisiKomentar(event)} className="admin__obrisi-objavu">
                Obriši
            </button>
        );
    }

    function obrisiKomentar(event: React.MouseEvent<HTMLButtonElement>)
    {
        const { target: kliknutoDugme } = event;
        const komentarHolder = (kliknutoDugme as HTMLButtonElement).closest(".objava__komentar-kontejner");
        const idKomentara = komentarHolder!.getAttribute("data-idkomentara");
        if(idKomentara)
        {
            console.log(idKomentara);
            fetch(`${OBRISI_KOMENTAR}/${idKomentara}`, {
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
                if(!odgovor.ok)
                {
                    throw new Error("Greska prilikom brisanja komentara");
                }

                alert("Uspesno obrisan komentar");
                setObjava((objava) => {
                    return {
                        ...objava,
                        komentari: objava.komentari.filter((objava) => objava.idKomentara !== parseInt(idKomentara))
                    };
                });
            })
            .catch((greska) => {
                alert("Javila se greska");
                console.log(greska);
            });
            /*=== ParseInt na id komentara, 
                    pa brisanje u Node i SQL, 
                    pa osvezim prikaz sa setState(()=>{}) 
            ===*/
        }
    }
}

export default PunaObjava;