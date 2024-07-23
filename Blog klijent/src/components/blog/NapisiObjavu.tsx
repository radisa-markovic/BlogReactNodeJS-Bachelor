import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import { AZURIRAJ_OBJAVU, DODAJ_NOVI_TAG, NAPRAVI_OBJAVU, OSNOVNI_PUT, SVI_TAGOVI } from "../../ApiPutanje";
import { Korisnik } from "../../models/Korisnik";
import { Objava } from "../../models/Objava";
import { Tag } from "../../models/Tag";
import { TipoviPasusa } from "../../models/TipoviPasusa";
import { upakujZahtev, uputiPoziv } from "../../ServisneStvari";
import Pasus from "../blog-alatke/Pasus";
import UnosSlike from "../blog-alatke/UnosSlike";
import { RichUtils } from "draft-js"

  
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";  
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


interface NovaObjava
{
    idAutora: number,
    naslov: string,
    podnaslov: string,
    sadrzaj: string,
    idjeviTagova: string[] /*<<-------- popunjavace se kasnije u formi*/
}

interface AppProps
{
    prijavljeniKorisnik: Korisnik;
}

export interface PasusMeta
{
    redniBroj: number,
    podnaslov: string,
    sadrzaj: string,
    vrstaPasusa: string
}

function NapisiObjavu(props: AppProps): JSX.Element
{
    const history = useHistory();
    /*za edit*/
    const { idObjave } = useParams<{idObjave: string}>();
    const [objava, setObjava] = useState<Objava>({
        id_autora: -1,
        URLNaslovneSlike: "",
        naslov: "", 
        kratakOpis: "",
        sadrzaj: "",
        tagovi: [],
        id: -1,
        komentari: [],
        korisnickoIme: "",
        brojKomentara: 0,
        brojLajkova: 0,
        brojDislajkova: 0,
        datumPisanja: ""
    });
    const [naslovniFajl, setNaslovniFajl] = useState<File | null>(null);
    const [podaciSeCekaju, setPodaciSeCekaju] = useState<boolean>(false);
    const [lokalniTagovi, setLokalniTagovi] = useState<Tag[]>([]);
    
    const [pasusi, setPasusi] = useState<PasusMeta[]>([
        // { redniBroj: 0, podnaslov: "Micko", sadrzaj: "Antisocijalnosamoupravni" },
        // { redniBroj: 1, podnaslov: "Micko", sadrzaj: "Antisocijalnosamoupravni" },
        // { redniBroj: 2, podnaslov: "Micko", sadrzaj: "Antisocijalnosamoupravni" }
    ]);
    const [slikeUPasusima, setSlikeUPasusima] = useState<File[]>([]);

    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
   

    // const [HTMLObjave, setHTMLObjave] = useState("");
    // const [imageSource, setImageSource] = useState("");

    const noviTagUnos = useRef<HTMLInputElement>(null);
    const unosClankaHolder = useRef<HTMLElement>(null);

    /*======= Ucitavanje objave ako idem edit =======*/
    useEffect(() => {
        if(idObjave)
        {
            fetch(`${OSNOVNI_PUT}/objava/${idObjave}`)
            .then((odgovor: Response) => {
                if(!odgovor.ok)
                    throw odgovor;

                return odgovor.json();
            })
            .then((objava: Objava) => {
                setObjava(objava);

                const blocksFromHTML = convertFromHTML(objava.sadrzaj);
                const content = ContentState.createFromBlockArray(
                    blocksFromHTML.contentBlocks,
                    blocksFromHTML.entityMap
                );
        
                setEditorState(EditorState.createWithContent(content));
            })
            .catch((greska) => {
                console.log(greska);
            })
        }       
    }, []);

    useEffect(() => {
        uputiPoziv(SVI_TAGOVI)
        .then((tagovi: Tag[]) => {
            /*i sad nacrtam tagove*/
            setLokalniTagovi(tagovi);
        })
        .catch((greska) => {
            console.log(greska);
        });       
    }, []);

    return (
        <main className="objava container donja-margina-potomci">
            <h1 className="objava__naslov">
                Naslov:
                <input type="text"
                       className="kontrola" 
                       placeholder="Naslov"
                       name="naslov"
                       onChange={promenaUnosa}
                       value={objava.naslov}
                       required
                /> 
            </h1>
            {/* fotografija naslovna*/}
            <div className="objava__naslov">
                <h2>Naslovna fotografija:</h2>
                {/* <img src={objava.URLNaslovneSlike} alt="Nema slike" /> */}
                <UnosSlike slikaJeNaslovna={true}
                           setNaslovnaSlika={setNaslovniFajl}
                           postaviSlikeSaBloga={setSlikeUPasusima}
                           urlStareSlike={objava.URLNaslovneSlike}
                />
            </div>
            <h2 className="objava__naslov">
                Kratak opis:
                <input type="text"
                       className="kontrola" 
                       placeholder="Kratak opis"
                       name="kratakOpis"
                       onChange={promenaUnosa}
                       value={objava.kratakOpis}
                       required
                /> 
            </h2>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={onPromenaEditorStateChange}
                toolbar={{
                    inline: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true },
                    image: { 
                        uploadCallback: aploudKolbek, 
                        previewImage: true, 
                        alt: { present: true, mandatory: true } 
                    },
                }}
            />
            <h2>
                Izaberi, ili dopiši tagove
            </h2>
            <div className="objava__odeljag-tagovi">
                <ul className="objava__tagovi">
                    { lokalniTagovi && nacrtajTagove() }
                </ul>
                <input type="text" 
                        className="kontrola"
                        placeholder="Unesi svoj tag"
                        name="noviTag"
                        ref={noviTagUnos}
                />
                <button className="objava__potvrdi-novi-tag"
                        onClick={potvrdiNoviTag}>
                    Potvrdi novi tag
                </button>
            </div>
        
            <div className="objava__kontejner-dugmica">
                {
                    idObjave ? (
                        <button onClick={azurirajObjavu}>
                            Ažuriraj objavu
                        </button>
                    )
                        : (
                        <button className="objava__dugme"
                                onClick={potvrdiObjavu}
                                disabled={podaciSeCekaju}
                        >
                            {podaciSeCekaju? "Zahtev se upucuje": "Potvrdi novu objavu"}
                        </button>
                        )
                }
                
                
                <button className="objava__dugme"
                        onClick={idiNaObjave}
                >
                    Nazad na objave
                </button>
            </div>
        </main>
    );

    function onPromenaEditorStateChange(newState: any)
    {
        setEditorState(newState);
        // console.log(newState);
        // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
        setObjava((staraObjava) => {
            return {
                ...staraObjava,
                sadrzaj: draftToHtml(convertToRaw(editorState.getCurrentContent()))
            };
        });
    }

    function aploudKolbek(file: any)
    {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("image", file);
            
            fetch(`${OSNOVNI_PUT}/uploadImage`, { 
                // headers: {
                //     'Content-Type': 'multipart/form-data',
                //     'Content-Length': ''
                //     // 'Content-Type': 'application/x-www-form-urlencoded',
                // },
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                body: formData
            })
            .then((odgovor) => {
                return odgovor.json();
            }).then((odgovorJSON) => {
                console.log(odgovorJSON);
                resolve({ data: { link: odgovorJSON.urlSlike } })
                // resolve(odgovorJSON);
            })
            .catch((greska) => {
                console.log(greska);
                reject();
            });
        });           
    }

    function promenaUnosa(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void
    {
        const { name, value } = event.target;
        setObjava({
            ...objava,
            [name]: value
        });
    }

    /*===============>>>> DODATI KOD ZA CEKIRANJE TAGOVA (koristiti setLokalneTagove()) <<<================*/
    function nacrtajTagove(): JSX.Element[]
    {
        return lokalniTagovi.map((lokalniTag, indeks) => {
            let tagJePrisutanNaObjavi: boolean = false;
            objava.tagovi.forEach((tag) => {
                if(tag.naziv === lokalniTag.naziv)
                    tagJePrisutanNaObjavi = true;
            });

            return (<li>
                        <input type="checkbox" 
                               name={lokalniTag.naziv} 
                               id={lokalniTag.id.toString()}
                               onChange={(event) => hendlujCekiranjeTaga(event)} 
                               checked={tagJePrisutanNaObjavi}
                        />{lokalniTag.naziv}
                    </li>);
        });
    }

    function potvrdiNoviTag()
    {
        const nazivNovogTaga = noviTagUnos.current!.value 
        const noviTag: Tag = {
            id: -1,
            naziv: nazivNovogTaga
        };
        uputiPoziv(DODAJ_NOVI_TAG, upakujZahtev("POST", noviTag))
        .then((odgovor) => {
            alert("Uspesno dodat tag, sad ce se iscrta na formi");
            setLokalniTagovi(lokalniTagovi.concat({
                id: odgovor.idNovogTaga,
                naziv: nazivNovogTaga
            }));
        })
        .catch((greska) => {
            console.log(greska);
            if(greska.statusText === "ER_DUP_ENTRY")
                alert("Vec postoji takav tag, unos nije dozvoljen");
        });
    }

    function hendlujCekiranjeTaga(event: React.ChangeEvent<HTMLInputElement>): void
    {
        const { target: kliknutTag } = event;
        console.log(kliknutTag.checked);

        if(kliknutTag.checked)
        {
            const tagZaDodavanje: Tag = {
                id: parseInt(kliknutTag.id),
                naziv: kliknutTag.name
            };

            setObjava((objava) => {
                return {
                    ...objava,
                    tagovi: objava.tagovi.concat(tagZaDodavanje)
                }
            });
        }
        else
        {
            setObjava({
                ...objava,
                tagovi: objava.tagovi.filter((objava) => objava.id !== parseInt(kliknutTag.id))
            });
        }
    }

    function idiNaObjave()
    {
        history.push("/sveObjave");
    }

    function potvrdiObjavu()
    {
        objava.id_autora = props.prijavljeniKorisnik.id;
        let datumPisanja = vratiDatumPisanja();
        objava.datumPisanja = datumPisanja;
        
        setPodaciSeCekaju(true);            
        /*====== 
            moram da unosClankaHolder obilazim elemente, motam u h2 i p,
            pa da takav sadrzaj sacuvam u bazu
        =========*/
        const objekatZahteva = upakujZahtev("POST", objava);
         /** Convert html string to draft JS */
        console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));

        uputiPoziv(NAPRAVI_OBJAVU, objekatZahteva)
        .then(objava => {
            const { idNoveObjave } = objava;
            let fajl = naslovniFajl;
            slikeUPasusima.forEach((fajl) => {
                let slikaJeNaslovna = true;
                okaciSlikuNaServer(naslovniFajl!, "" + idNoveObjave + "", slikaJeNaslovna);
            });
            alert("Uspesno dodata objava");
            history.push("/sveObjave");
        })
        .catch((greska) => {
            alert("Ne valja");
            console.log(greska);
        })
        .finally(() => {
            setPodaciSeCekaju(false);
        });
        // slikeUPasusima.forEach((fajl) => {
        //     okaciSlikuNaServer(fajl);
        // });
       


    //    uputiZahtevKaBazi(OBJAVE_API, () => {},objekatZahteva);
    }

    function vratiDatumPisanja(): string
    {
        let datumPisanja = new Date();
        /*nije getDay(), ta metoda vraca redni broj dana u nedelji (npr cetvrtak -> 4)*/
        let dan = datumPisanja.getDate();
        let mesec = datumPisanja.getMonth() + 1;
        let godina = datumPisanja.getFullYear();

        return [godina, mesec, dan].join("-");
    }

    function okaciSlikuNaServer(fajl: File, idClanka: string, slikaJeNaslovna: boolean)
    {
        const formData = new FormData();
        formData.append("image", fajl);
        formData.append("idClanka", idClanka);

        if(slikaJeNaslovna === true)
            formData.append("slikaJeNaslovna", "da");
        else
            formData.append("slikaJeNaslovna", "ne");
        
        fetch(`${OSNOVNI_PUT}/uploadImage`, { 
            // headers: {
            //     'Content-Type': 'multipart/form-data',
            //     'Content-Length': ''
            //     // 'Content-Type': 'application/x-www-form-urlencoded',
            // },
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            body: formData
        })
        .then((odgovor) => {
            return odgovor.json();
        })
        .catch((greska) => {
            console.log(greska);
        });
    }

    function azurirajObjavu()
    {
        const objekatZahteva = upakujZahtev("PATCH", objava);
        uputiPoziv(`${AZURIRAJ_OBJAVU}/idObjave`, objekatZahteva)
        .then((odgovor) => {
            okaciSlikuNaServer(naslovniFajl!, idObjave, true);
            alert("Uspešno ažuriranje objave");
            history.push("/sveObjave");
        }).catch((greska) => {
            console.error(greska);
        });
    }
}

export default NapisiObjavu;