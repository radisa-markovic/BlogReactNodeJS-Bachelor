import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import { AZURIRAJ_OBJAVU, DODAJ_NOVI_TAG, NAPRAVI_OBJAVU, OSNOVNI_PUT, SVI_TAGOVI } from "../../ApiPutanje";
import { Korisnik } from "../../models/Korisnik";
import { Objava } from "../../models/Objava";
import { Tag } from "../../models/Tag.refactor";
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
import { validatePost } from "../../validators/Post";
import FormError from "../FormError";
import { useLocation } from "react-router-dom";
import { Post } from "../../models/Post-refactor";


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

interface NewPost
{
    title: string;
    description: string;
    content: string;
    coverImage: File;
    userId: number
    // createdAt: Date;
    // updatedAt: Date;
}

interface PostProps
{
    accessToken: string,
    userData: {
        username: string,
        id: number
    }
}

const NapisiObjavu: React.FC<PostProps> = ({
    accessToken,
    userData
}) => {
    const [title, setTitle] = useState<string>('');
    const [titleError, setTitleError] = useState<string>('');

    const [description, setDescription] = useState<string>('');
    const [descriptionError, setDescriptionError] = useState<string>('');

    const [content, setContent] = useState<string>('');
    const [contentError, setContentError] = useState<string>('');

    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverImageError, setCoverImageError] = useState<string>('');

    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

    const [tags, setTags] = useState<Tag[]>([]);

    const history = useHistory();
    const { id } = useParams<{id: string}>();
    const { search } = useLocation();

    const isEditMode: boolean = new URLSearchParams(search).get("edit") === "true"? true: false;
    const isCreationMode: boolean = id? false : true; 

    useEffect(() => {
        if(id)
        {
            fetch("http://localhost:3002/posts/" + id)
                .then((response) => response.json())
                .then((jsonResponse: {message: string, post: Post, OP: any}) => {
                    setTitle(jsonResponse.post.title);
                    setDescription(jsonResponse.post.description);
                    setContent(jsonResponse.post.content);
                    setCoverImageUrl(jsonResponse.post.coverImageUrl);
                })
                .catch(error => console.log(error));
        }

        const tag_url: string = "http://localhost:3002/tags";
        fetch(tag_url)
            .then((response) => response.json())
            .then((jsonResponse) => {
                console.log(jsonResponse);
            })
    }, []);
    
    // useEffect(() => {
    //     // console.log(search);
    //     console.log(new URLSearchParams(search).get("edit"));
    // }, []);

    const createPost = async () => {
        const new_post_api = "http://localhost:3002/posts/create";
        setTitleError('');
        setDescriptionError('');
        setContentError('');
        setCoverImageError('');

        const validationErrors = validatePost({
            title,
            description,
            content,
            coverImage
        });

        if(validationErrors.errorsExist)
        {
            if(validationErrors.titleError && validationErrors.titleError !== '')
                setTitleError(validationErrors.titleError);
    
            if(validationErrors.descriptionError && validationErrors.descriptionError !== '')
                setDescriptionError(validationErrors.descriptionError);
    
            if(validationErrors.contentError && validationErrors.contentError !== '')
                setContentError(validationErrors.contentError)
    
            if(validationErrors.coverImageError && validationErrors.coverImageError !== '')
                setCoverImageError(validationErrors.coverImageError)
        }
        else
        {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("content", content);
            formData.append('userId', userData.id.toString());
            formData.append("coverImage", coverImage!);
    
            const request: RequestInit = {
                headers: {
                    "Authorization": "Bearer " + accessToken
                },
                method: "POST",
                // mode: 'cors',
                body: formData
            };
            
            const response = await fetch(new_post_api, request);
            console.log(response);
            if(response.status === 401)
            {
                console.log(accessToken);
                alert("Not authorized to post");
            }
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            history.push("/sveObjave");
        }        
    }

    /*za edit*/
    // const { idObjave } = useParams<{idObjave: string}>();
    // const [objava, setObjava] = useState<Objava>({
    //     id_autora: -1,
    //     URLNaslovneSlike: "",
    //     naslov: "", 
    //     kratakOpis: "",
    //     sadrzaj: "",
    //     tagovi: [],
    //     id: -1,
    //     komentari: [],
    //     korisnickoIme: "",
    //     brojKomentara: 0,
    //     brojLajkova: 0,
    //     brojDislajkova: 0,
    //     datumPisanja: ""
    // });
    // const [naslovniFajl, setNaslovniFajl] = useState<File | null>(null);
    // const [podaciSeCekaju, setPodaciSeCekaju] = useState<boolean>(false);
    // const [lokalniTagovi, setLokalniTagovi] = useState<Tag[]>([]);
    
    // const [pasusi, setPasusi] = useState<PasusMeta[]>([
        // { redniBroj: 0, podnaslov: "Micko", sadrzaj: "Antisocijalnosamoupravni" },
        // { redniBroj: 1, podnaslov: "Micko", sadrzaj: "Antisocijalnosamoupravni" },
        // { redniBroj: 2, podnaslov: "Micko", sadrzaj: "Antisocijalnosamoupravni" }
    // ]);
    // const [slikeUPasusima, setSlikeUPasusima] = useState<File[]>([]);

    // const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
   

    // const [HTMLObjave, setHTMLObjave] = useState("");
    // const [imageSource, setImageSource] = useState("");

    // const noviTagUnos = useRef<HTMLInputElement>(null);
    // const unosClankaHolder = useRef<HTMLElement>(null);

    /*======= Ucitavanje objave ako idem edit =======*/
    // useEffect(() => {
    //     if(idObjave)
    //     {
    //         fetch(`${OSNOVNI_PUT}/objava/${idObjave}`)
    //         .then((odgovor: Response) => {
    //             if(!odgovor.ok)
    //                 throw odgovor;

    //             return odgovor.json();
    //         })
    //         .then((objava: Objava) => {
    //             setObjava(objava);

    //             const blocksFromHTML = convertFromHTML(objava.sadrzaj);
    //             const content = ContentState.createFromBlockArray(
    //                 blocksFromHTML.contentBlocks,
    //                 blocksFromHTML.entityMap
    //             );
        
    //             setEditorState(EditorState.createWithContent(content));
    //         })
    //         .catch((greska) => {
    //             console.log(greska);
    //         })
    //     }       
    // }, []);

    // useEffect(() => {
    //     uputiPoziv(SVI_TAGOVI)
    //     .then((tagovi: Tag[]) => {
    //         /*i sad nacrtam tagove*/
    //         setLokalniTagovi(tagovi);
    //     })
    //     .catch((greska) => {
    //         console.log(greska);
    //     });       
    // }, []);
    
    console.log(isEditMode);

    return (
        <main className="objava container donja-margina-potomci">
            {
                isCreationMode
                ?
                <form>
                    <div>
                        {
                            coverImageError !== '' &&
                            <FormError errorText={coverImageError} />
                        }
                        <img 
                            src={coverImage? URL.createObjectURL(coverImage) : '' } 
                            alt="" 
                        />
                        <label htmlFor="" style={{fontSize: '16px'}}>
                            Naslovna fotografija
                        </label>
                        <input 
                            type="file" 
                            name="coverImageInput" 
                            id="coverImageInput" 
                            accept=".jpg, .jpeg, .png"
                            onChange={({target}) => setCoverImage(target.files && target.files[0])}
                        />
                    </div>
                    <div>
                        {
                            titleError !== '' &&
                            <FormError errorText={titleError} />
                        }
                        <label style={{fontSize: '16px'}}>
                            Naslov:
                        </label>
                        <input 
                            type="text"
                            className="kontrola" 
                            placeholder="Naslov"
                            name="naslov"
                            onChange={({target}) => setTitle(target.value)}
                            value={isEditMode? title : ''}
                            required
                        />
                    </div>
                    <div>
                        {
                            descriptionError !== '' &&
                            <FormError errorText={descriptionError} />
                        }
                        <label htmlFor="" style={{fontSize: '16px'}}>
                            Kratak opis
                        </label>
                        <input 
                            type="text"
                            className="kontrola" 
                            placeholder="Kratak opis"
                            name="kratakOpis"
                            onChange={({target}) => setDescription(target.value)}
                            value={isEditMode? description : ''}
                        /> 
                    </div>
                    <div>
                        <label style={{fontSize: '16px'}}>
                            Sadržaj:
                        </label>
                        <br/>
                        <textarea 
                            name="content" 
                            id="content"
                            style={{
                                fontSize: '16px'
                            }}
                            onChange={({target}) => setContent(target.value)}
                            value={isEditMode? content: ''}
                        ></textarea>
                    </div>

                    <button 
                        type="button"
                        onClick={createPost}
                    >
                        Napravi objavu
                    </button>
                </form>
                :
                <article>
                    <div>
                        <img src={coverImageUrl? coverImageUrl : ''} alt="" />
                    </div>
                    <h1>
                        { title }
                    </h1>
                    <h2 className="objava__naslov">
                        { description }
                    </h2>
                    <div style={{fontSize: '16px'}}>
                        { content }
                    </div>
                </article>
            }
            {/* fotografija naslovna*/}
            <div className="objava__naslov">
                {/* <h2>Naslovna fotografija:</h2> */}
                
                
                {/* <img src={objava.URLNaslovneSlike} alt="Nema slike" /> */}
                {/* <UnosSlike 
                    slikaJeNaslovna={true}
                    setNaslovnaSlika={setNaslovniFajl}
                    postaviSlikeSaBloga={setSlikeUPasusima}
                    urlStareSlike={objava.URLNaslovneSlike}
                /> */}
            </div>
            {/* <Editor
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
            /> */}
            {/* <h2>
                Izaberi, ili dopiši tagove
            </h2>
            <div className="objava__odeljag-tagovi">
                <ul className="objava__tagovi">
                    { lokalniTagovi && nacrtajTagove() }
                </ul> */}
                {/* <input 
                    type="text" 
                    className="kontrola"
                    placeholder="Unesi svoj tag"
                    name="noviTag"
                    ref={noviTagUnos}
                />
                <button 
                    className="objava__potvrdi-novi-tag"
                    onClick={potvrdiNoviTag}
                >
                    Potvrdi novi tag
                </button>
            </div> */}
        
            {/* <div className="objava__kontejner-dugmica">
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
                } */}
                
                
                {/* <button className="objava__dugme"
                        onClick={idiNaObjave}
                >
                    Nazad na objave
                </button> */}
            {/* </div> */}
            {/* <button
                onClick={() => createPost()}
            >
                Napravi objavu
            </button> */}
        </main>
    );

    function onPromenaEditorStateChange(newState: any)
    {
        // setEditorState(newState);
        // console.log(newState);
        // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
        // setObjava((staraObjava) => {
        //     return {
        //         ...staraObjava,
        //         sadrzaj: draftToHtml(convertToRaw(editorState.getCurrentContent()))
        //     };
        // });
    }

    // function aploudKolbek(file: any)
    // {
    //     return new Promise((resolve, reject) => {
    //         const formData = new FormData();
    //         formData.append("image", file);
            
    //         fetch(`${OSNOVNI_PUT}/uploadImage`, { 
    //             // headers: {
    //             //     'Content-Type': 'multipart/form-data',
    //             //     'Content-Length': ''
    //             //     // 'Content-Type': 'application/x-www-form-urlencoded',
    //             // },
    //             method: "POST", // *GET, POST, PUT, DELETE, etc.
    //             mode: 'cors', // no-cors, *cors, same-origin
    //             body: formData
    //         })
    //         .then((odgovor) => {
    //             return odgovor.json();
    //         }).then((odgovorJSON) => {
    //             console.log(odgovorJSON);
    //             resolve({ data: { link: odgovorJSON.urlSlike } })
    //             // resolve(odgovorJSON);
    //         })
    //         .catch((greska) => {
    //             console.log(greska);
    //             reject();
    //         });
    //     });           
    // }

    // function promenaUnosa(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void
    // {
    //     const { name, value } = event.target;
    //     setObjava({
    //         ...objava,
    //         [name]: value
    //     });
    // }

    /*===============>>>> DODATI KOD ZA CEKIRANJE TAGOVA (koristiti setLokalneTagove()) <<<================*/
    // function nacrtajTagove(): JSX.Element[]
    // {
    //     return lokalniTagovi.map((lokalniTag, indeks) => {
    //         let tagJePrisutanNaObjavi: boolean = false;
    //         objava.tagovi.forEach((tag) => {
    //             if(tag.naziv === lokalniTag.naziv)
    //                 tagJePrisutanNaObjavi = true;
    //         });

    //         return (<li>
    //                     <input type="checkbox" 
    //                            name={lokalniTag.naziv} 
    //                            id={lokalniTag.id.toString()}
    //                            onChange={(event) => hendlujCekiranjeTaga(event)} 
    //                            checked={tagJePrisutanNaObjavi}
    //                     />{lokalniTag.naziv}
    //                 </li>);
    //     });
    // }

    // function potvrdiNoviTag()
    // {
    //     const nazivNovogTaga = noviTagUnos.current!.value 
    //     const noviTag: Tag = {
    //         id: -1,
    //         naziv: nazivNovogTaga
    //     };
    //     uputiPoziv(DODAJ_NOVI_TAG, upakujZahtev("POST", noviTag))
    //     .then((odgovor) => {
    //         alert("Uspesno dodat tag, sad ce se iscrta na formi");
    //         setLokalniTagovi(lokalniTagovi.concat({
    //             id: odgovor.idNovogTaga,
    //             naziv: nazivNovogTaga
    //         }));
    //     })
    //     .catch((greska) => {
    //         console.log(greska);
    //         if(greska.statusText === "ER_DUP_ENTRY")
    //             alert("Vec postoji takav tag, unos nije dozvoljen");
    //     });
    // }

    // function hendlujCekiranjeTaga(event: React.ChangeEvent<HTMLInputElement>): void
    // {
    //     const { target: kliknutTag } = event;
    //     console.log(kliknutTag.checked);

    //     if(kliknutTag.checked)
    //     {
    //         const tagZaDodavanje: Tag = {
    //             id: parseInt(kliknutTag.id),
    //             naziv: kliknutTag.name
    //         };

    //         setObjava((objava) => {
    //             return {
    //                 ...objava,
    //                 tagovi: objava.tagovi.concat(tagZaDodavanje)
    //             }
    //         });
    //     }
    //     else
    //     {
    //         setObjava({
    //             ...objava,
    //             tagovi: objava.tagovi.filter((objava) => objava.id !== parseInt(kliknutTag.id))
    //         });
    //     }
    // }

    function idiNaObjave()
    {
        history.push("/sveObjave");
    }

    // function potvrdiObjavu()
    // {
    //     objava.id_autora = props.prijavljeniKorisnik.id;
    //     let datumPisanja = vratiDatumPisanja();
    //     objava.datumPisanja = datumPisanja;
        
    //     setPodaciSeCekaju(true);            
    //     /*====== 
    //         moram da unosClankaHolder obilazim elemente, motam u h2 i p,
    //         pa da takav sadrzaj sacuvam u bazu
    //     =========*/
    //     const objekatZahteva = upakujZahtev("POST", objava);
    //      /** Convert html string to draft JS */
    //     console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));

    //     uputiPoziv(NAPRAVI_OBJAVU, objekatZahteva)
    //     .then(objava => {
    //         const { idNoveObjave } = objava;
    //         let fajl = naslovniFajl;
    //         slikeUPasusima.forEach((fajl) => {
    //             let slikaJeNaslovna = true;
    //             okaciSlikuNaServer(naslovniFajl!, "" + idNoveObjave + "", slikaJeNaslovna);
    //         });
    //         alert("Uspesno dodata objava");
    //         history.push("/sveObjave");
    //     })
    //     .catch((greska) => {
    //         alert("Ne valja");
    //         console.log(greska);
    //     })
    //     .finally(() => {
    //         setPodaciSeCekaju(false);
    //     });
    //     // slikeUPasusima.forEach((fajl) => {
    //     //     okaciSlikuNaServer(fajl);
    //     // });
       


    // //    uputiZahtevKaBazi(OBJAVE_API, () => {},objekatZahteva);
    // }

    // function vratiDatumPisanja(): string
    // {
    //     let datumPisanja = new Date();
    //     /*nije getDay(), ta metoda vraca redni broj dana u nedelji (npr cetvrtak -> 4)*/
    //     let dan = datumPisanja.getDate();
    //     let mesec = datumPisanja.getMonth() + 1;
    //     let godina = datumPisanja.getFullYear();

    //     return [godina, mesec, dan].join("-");
    // }

    // function okaciSlikuNaServer(fajl: File, idClanka: string, slikaJeNaslovna: boolean)
    // {
    //     const formData = new FormData();
    //     formData.append("image", fajl);
    //     formData.append("idClanka", idClanka);

    //     if(slikaJeNaslovna === true)
    //         formData.append("slikaJeNaslovna", "da");
    //     else
    //         formData.append("slikaJeNaslovna", "ne");
        
    //     fetch(`${OSNOVNI_PUT}/uploadImage`, { 
    //         // headers: {
    //         //     'Content-Type': 'multipart/form-data',
    //         //     'Content-Length': ''
    //         //     // 'Content-Type': 'application/x-www-form-urlencoded',
    //         // },
    //         method: "POST", // *GET, POST, PUT, DELETE, etc.
    //         mode: 'cors', // no-cors, *cors, same-origin
    //         body: formData
    //     })
    //     .then((odgovor) => {
    //         return odgovor.json();
    //     })
    //     .catch((greska) => {
    //         console.log(greska);
    //     });
    // }

    // function azurirajObjavu()
    // {
    //     const objekatZahteva = upakujZahtev("PATCH", objava);
    //     uputiPoziv(`${AZURIRAJ_OBJAVU}/idObjave`, objekatZahteva)
    //     .then((odgovor) => {
    //         okaciSlikuNaServer(naslovniFajl!, idObjave, true);
    //         alert("Uspešno ažuriranje objave");
    //         history.push("/sveObjave");
    //     }).catch((greska) => {
    //         console.error(greska);
    //     });
    // }
}

export default NapisiObjavu;