import React, { useEffect, useState } from "react";
import { OBJAVE_API, PRETRAZI_NASLOV_OBJAVE } from "../../ApiPutanje";
import { Objava } from "../../models/Objava";
import { Tag } from "../../models/Tag";
import Paginacija from "../blog-alatke/Paginacija";
import PretragaPoTagovima from "../blog-alatke/PretragaPoTagovima";
import UnosSaPredlozima from "../UnosSaPredlozima";
import PregledObjave from "./PostPreviewCard";
import { Post } from "../../models/Post-refactor";
import PostPreviewCard from "./PostPreviewCard";

// interface Props
// {
//     adminJePrijavljen: boolean,
//     prijavljenoKorisnickoIme: string
// }

const PostList: React.FC<any> = (props) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDateDescending, setIsDateDescending] = useState<boolean>(true);

    const ASCENDING_VALUE: string = 'ascending';
    const DESCENDING_VALUE: string = 'descending';

    useEffect(() =>{
        let posts_api = "http://localhost:3002/posts";
        if(isDateDescending)
            posts_api += "?date=ASC";
        else
            posts_api += "?date=DESC";

        setIsLoading(true);

        fetch(posts_api)
            .then((response) => response.json())
            .then((jsonResponse) => {
                setPosts(jsonResponse.posts);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [isDateDescending]);

    const sortByDate = (directionDate: string) => {
        if(directionDate === DESCENDING_VALUE)
            setIsDateDescending(true);
        else
            if(directionDate === ASCENDING_VALUE)
                setIsDateDescending(false);
    }

    return (
        <main className="container">
            {
                isLoading 
                    ? 
                    <h1>Loading posts</h1>
                    : 
                    <div>
                        <h1>Posts</h1> 
                        <div>
                            <p style={{fontSize: '16px'}}>Filter:</p>
                            <div>
                                <p style={{fontSize: '16px'}}>
                                    Sort by date:
                                </p>
                                <select 
                                    name="sortByDate" 
                                    id="sortByDate"
                                    onChange={({target}) => sortByDate(target.value)}
                                    style={{fontSize: '16px'}}
                                >
                                    <option value={DESCENDING_VALUE}>
                                        Descending
                                    </option>
                                    <option value={ASCENDING_VALUE}>
                                        Ascending
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className="objava__spisak">
                            {
                                posts.map((post) => 
                                    <PostPreviewCard 
                                        post={post}
                                    />
                                )
                            }
                        </div>
                    </div>
            }
        </main>
    );
}

export default PostList;

// const SpisakObjava: React.FC<Props> = (props: Props) => {
   

//     const [objave, setObjave] = useState<Objava[]>([]);
//     const [greska, setGreska] = useState<boolean>(false);
//     const [podaciSeCekaju, setPodaciSeCekaju] = useState<boolean>(true);
//     const [odabraniTag, setOdabraniTag] = useState<string>("");
    
//     const [naslovObjave, setNaslovObjave] = useState("");
//     const [najnovijePrvo, setNajnovijePrvo] = useState<boolean>(true);
    
//     const [odabraniTagovi, setOdabraniTagovi] = useState<Tag[]>([]);
//     const [iskljuceniTagovi, setIskljuceniTagovi] = useState<Tag[]>([]);

    

    // useEffect(() => {
    //     const naziviTagovaUString = spojiNaziveTagovaUString();
    //     const naziviIskljucenihTagovaUString = spojiIskljuceneTagoveUString();

    //     let urlZaObjave = `${OBJAVE_API}/6/${0*6}/-/true/`;
        
    //     if(naziviTagovaUString !== "")
    //     {
    //         urlZaObjave += `?odabraniTagovi=${naziviTagovaUString}`;
    //     }
        
    //     if(naziviIskljucenihTagovaUString !== "")
    //     {
    //         urlZaObjave += `?iskljuceniTagovi=${naziviIskljucenihTagovaUString}`;
    //     }
    //     /*=========== ako nemam odabrane tagove ===========*/
    //     fetch(urlZaObjave)
    //     .then((odgovor: Response) => {
    //         if(!odgovor.ok)
    //             throw odgovor;

    //         return odgovor.json();
    //     })
    //     .then((objave) => {
    //         setObjave(objave);
    //     })
    //     .catch(greska => console.log(greska))
    //     .finally(() => {
    //         setPodaciSeCekaju(false);
    //     });

    // }, [odabraniTagovi, iskljuceniTagovi]);

    

    // return(
    //     <main className="container">
    //         { greska && <p>Greska neka baki</p> }
    //         { podaciSeCekaju && <p>Ucitavanje...</p>}
    //         <header>
    //             <h2>Pretraži objave:</h2>
    //             <div className="">
    //                 <UnosSaPredlozima 
    //                     onChangeHandler={promenaUnosa} 
    //                     bindingPropertyName="naslov"
    //                     setPropertyName={setNaslovObjave}
    //                     urlPutanja={PRETRAZI_NASLOV_OBJAVE}
    //                     placeholder="Unesi naslov objave"
    //                 />
    //             </div>
    //             <div>
    //                 <h2>Uredi objave po datumu:</h2>
    //                 <select name="objavePoDatumu" id="objavePoDatumu" onChange={(event) => sortirajObjavePoDatumu(event)}>
    //                     <option value="najnovijePrvo" selected>Najnovije prvo</option>
    //                     <option value="najstarijePrvo">Najstarije prvo</option>
    //                 </select>
    //             </div>
    //             <PretragaPoTagovima 
    //                 podesiTagoveZaFilter={setOdabraniTagovi} 
    //                 podesiTagoveZaIskljucenje={setIskljuceniTagovi}
    //             />
    //             { odabraniTag && prikaziObjavePodTagom(odabraniTag)}
    //         </header>
    //         {/*=========== OVDE SE ISCRTAVAJU POJEDINACNE OBJAVE ===========*/}
    //         <div className="objava__spisak">
    //             {/* { nacrtajObjave() } */}
    //             {
    //                 isLoading ? <p>Loading...</p>
    //                 : posts.map((post) => 
    //                     <PregledObjave 
    //                         adminJePrijavljen={false}
    //                         post={post}
    //                         prijavljeniKorisnikNapisaoObjavu={false}
    //                     />
    //                     )
    //             }
    //         </div>
    //         {/* <Paginacija brojElemenataPoStranici={6}
    //                     urlZaPaginaciju={OBJAVE_API}
    //                     korisnickoIme=""
    //                     najnovijePrvo={najnovijePrvo}
    //                     postaviElemente={setObjave}
    //         /> */}
    //     </main>
    // );

    // function sortirajObjavePoDatumu(event: React.ChangeEvent<HTMLSelectElement>)
    // {
    //     console.log(event.target.value);
    //     const { value: odabranoSortiranje } = event.target;
    //     if(odabranoSortiranje === "najnovijePrvo")
    //     {
    //         setNajnovijePrvo(true);
    //     }
    //     else
    //     {
    //         setNajnovijePrvo(false);
    //     }
    // }

    // function nacrtajObjave(): JSX.Element | JSX.Element[]
    // {       
    //     if(!isLoading && posts.length === 0)
    //         return <p>Nema nijedne objave</p>;
    //     else
    //         return posts.map((objava, indeks) => {
    //             return <PregledObjave objava={objava} 
    //                                   adminJePrijavljen={props.adminJePrijavljen}
    //                                   key={indeks} 
    //                                   setObjave={setObjave}
    //                                   setOdabraniTag={setOdabraniTag}
    //                                   prijavljeniKorisnikNapisaoObjavu={objava.korisnickoIme === props.prijavljenoKorisnickoIme}
    //                     />
    //         });
    // }

//     function prikaziObjavePodTagom(odabraniTag: string): JSX.Element
//     {
//         return (
//         <>
//             <p>Odabran je tag: {odabraniTag}</p>
//             <button onClick={ocistiTagove}>Očisti tag</button>
//         </>
//         );
//     }

//     function ocistiTagove()
//     {
//         setOdabraniTag("");
//     }

//     function promenaUnosa(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void
//     {
//         const { name, value } = event.target;
//         setNaslovObjave(value);
//     }

//     function spojiNaziveTagovaUString(): string
//     {
//         return odabraniTagovi.map((tag) => tag.naziv).join();
//     }

//     function spojiIskljuceneTagoveUString(): string
//     {
//         return iskljuceniTagovi.map((iskljuceniTag) => iskljuceniTag.naziv).join();
//     }
// }

// export default SpisakObjava;