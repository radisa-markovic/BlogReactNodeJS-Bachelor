import React, { useState } from "react";
import { Objava } from "../../models/Objava";
import { upakujZahtev, uputiPoziv } from "../../ServisneStvari";

interface Props
{
    urlStareSlike: string,
    slikaJeNaslovna: boolean,
    postaviSlikeSaBloga: Function
    setNaslovnaSlika?: React.Dispatch<React.SetStateAction<File | null>>
}

export default function UnosSlike(props: Props): JSX.Element
{
    const [fajl, setFajl] = useState<File | null>(null);
    const [kaoUnikatanID, setKaoUnikatanID] = useState(Date.now().toString());

    return(
        <>
            <form method="post" 
                  encType="multipart/form-data"
                  onSubmit={(event) => sacuvajSlikuNaServer(event)}    
            >
                <div>
                    <label htmlFor={"image_uploads" + "_" + kaoUnikatanID}
                           className="dugme-dodaj-sliku"
                    >
                        Izaberi sliku (PNG, JPG)
                    </label>
                    <input type="file" 
                            id={"image_uploads" + "_" + kaoUnikatanID} 
                            name="image" /*mora da bude isto kao u node.js multer-u*/ 
                            accept=".jpg, .jpeg, .png"
                            onChange={(event) => postaviSliku(event)}
                            style={{display: "none"}}
                    />
                </div>
                <div className="preview"
                    //  ref={pregledSlikeHolder}
                >
                    {
                        fajl? prikaziSliku(fajl) 
                            : props.urlStareSlike? 
                                <img src={props.urlStareSlike} alt="" />
                                : <></>
                    }
                </div>
                {
                    fajl ? (<div>
                                <button>
                                    Sačuvaj sliku na serveru
                                </button>
                            </div>) 
                        : <></>
                }
            </form> 
        </>
    );

    function postaviSliku(event: React.ChangeEvent<HTMLInputElement>)
    {
        const { target: fajlHolder } = event;
        const { files: fajlovi } = fajlHolder;

        /*valjda ovo uklanja ovaj fajl*/
        // props.postaviSlikeSaBloga((stareSlike: any) => stareSlike.filter((staraSlika: any) => staraSlika !== fajl));

        if(fajlovi)
        {
            setFajl(fajlovi[0]);
            if(props.slikaJeNaslovna === true)
            {
                props.setNaslovnaSlika && props.setNaslovnaSlika(fajlovi[0]);
            }
            
            props.postaviSlikeSaBloga((stareSlike: any) => [...stareSlike, fajlovi[0]]);            
        }   
    }

    function prikaziSliku(fajl: File): JSX.Element
    {
        return (
            <>
                <img src={URL.createObjectURL(fajl)}/>
            </>
        );
    }

    function sacuvajSlikuNaServer(event: React.FormEvent<HTMLFormElement>)
    {
        event.preventDefault();

        if(fajl)
        {
            const formData = new FormData();
            formData.append("image", fajl);
           
            fetch("http://localhost:3002/uploadImage", { 
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
            .then((odgovorJSON) => {
                console.log(odgovorJSON);
                const putanjaDoFajla = odgovorJSON.putanjaDoFajla.replace(/\\/g, "/");
                // props.postaviURLFotografije && 
                // props.postaviURLFotografije("http://localhost:3002" + putanjaDoFajla);
            })
            .catch((greska) => {
                console.log(greska);
            });
        }
    }
}