import React, { useState } from "react";
import { PLACEHOLDER_COVER_IMAGE, PLACEHOLDER_PROFILE_IMAGE, URL_ZA_KORISNICKE_SLIKE } from "../../ApiPutanje";

interface Props
{
    idKorisnika: number,
    tipKorisnickeSlike: string,
    putanjaDoStareSlike: string,
    postaviSliku: React.Dispatch<React.SetStateAction<File | null>>
}

export default function NoviUnosSlike(props: Props): JSX.Element
{
    const [slika, setSlika] = useState<File | null>(null);
    const [randomIdZaLabelu, setRandomIdZaLabelu] = useState(Date.now());

    return (
        <form encType="multipart/form-data"
                  onSubmit={(event) => postaviSlikuNaServer(event)}    
        >
            <div>
                <label htmlFor={randomIdZaLabelu.toString()}
                    className="dugme-dodaj-sliku"
                >
                    Izaberi { vratiTipSlikeZaNatpis() } sliku
                </label>
                <input type="file" 
                    name="image" /*mora da bude isto kao u node.js multer-u*/ 
                    id={randomIdZaLabelu.toString()}
                    accept=".jpg, .jpeg, .png"
                    onChange={(event) => setujSliku(event)}
                    style={{display: "none"}}
                />
            </div>
            { 
                postojiSlikaZaPromenu() 
                    && (<button style={{margin: 'auto', display: 'block'}}>
                            Okaci sliku na server
                        </button>) 
            }
        </form>
    );

    function postojiSlikaZaPromenu(): boolean
    {
        //De Morganovi zakoni ftw
        return !(slika === null || slika === undefined);
    }

    function setujSliku(event: React.ChangeEvent<HTMLInputElement>)
    {
        const { target: fajlHolder } = event;
        const { files: fajlovi } = fajlHolder;

        if(fajlovi)
        {
            setSlika(fajlovi[0]);
            props.postaviSliku(fajlovi[0]);
        }
    }

    /*isti URL nek ide za slike, na serveru zavisno od tipa slike ce ide filter
    a i httpMetoda ce da se odredi zavisno od toga dal vec ima slike ili ne*/
    function postaviSlikuNaServer(event: React.FormEvent<HTMLFormElement>)
    {
        event.preventDefault();
        if(slika)
        {
            const formData = new FormData();
            formData.append("image", slika);
            /*=== naslovna ili profilna ===*/
            formData.append("tipKorisnickeSlike", props.tipKorisnickeSlike);
            formData.append("idKorisnika", props.idKorisnika.toString());

            let httpMetoda: string = "";
            if(props.putanjaDoStareSlike === PLACEHOLDER_PROFILE_IMAGE || PLACEHOLDER_COVER_IMAGE)
            {
                httpMetoda = "POST";
            }
            else
            {
                httpMetoda = "PATCH";
            }
            
            debugger;
            console.log(httpMetoda);

            fetch(URL_ZA_KORISNICKE_SLIKE, {
                method: httpMetoda, // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                body: formData
            }).then((odgovor) => {
                console.log(odgovor);
                alert("Okacena slika na server");
            }).catch((greska) => {
                console.log(greska);
            });
        }
    }

    function vratiTipSlikeZaNatpis(): string
    {
        if(props.tipKorisnickeSlike === "naslovna")
            return "naslovnu";

        if(props.tipKorisnickeSlike === "profilna")
            return "profilnu";

        return "";
    }
}