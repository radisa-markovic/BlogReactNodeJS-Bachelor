import React, { useEffect, useState } from "react";

export interface MoguceGreske
{
    korisnickoImeJePogresno?: boolean,
    lozinkaJePogresna?: boolean,
    korisnickoImeJeZauzeto?: boolean
}

export interface FetchPodaci<T>
{
    podaci: T | null,
    podaciSeCekaju: boolean,
    setPodaciSeCekaju: React.Dispatch<React.SetStateAction<boolean>>,
    greska: MoguceGreske,
    upakujZahtev: (metoda: string, objekat: object) => object,
    uputiZahtevKaBazi: (URL: string, objekat?: object) => Promise<any>,
    setPodaci: React.Dispatch<React.SetStateAction<T | null>>,
    setGreska: React.Dispatch<React.SetStateAction<MoguceGreske>>
}

const useFetch = <T>(URL: string, hendlujPodatke?: Function, objekat?: object): FetchPodaci<T> => {
    
    const [podaci, setPodaci] = useState<T | null>(null);
    const [podaciSeCekaju, setPodaciSeCekaju] = useState(false);
    const [greska, setGreska] = useState<MoguceGreske>({
        korisnickoImeJePogresno: false,
        lozinkaJePogresna: false,
        korisnickoImeJeZauzeto: false
    });

    useEffect(() => {
        if(URL !== "")
            uputiZahtevKaBazi(URL, objekat);
    }, [URL]);

    function upakujZahtev(metoda: string, objekat: object)
    {
        return {
            method: metoda, // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(objekat)
        };
    }

    function uputiZahtevKaBazi(URL: string, objekatZahteva?: object): Promise<any>
    {
        setPodaciSeCekaju(true);
        return fetch(URL, objekatZahteva)
               .then((odgovor: Response) => {
                   if(!odgovor.ok)
                   {
                       console.log(odgovor);
                       throw odgovor;
                   }

                   return odgovor.json();
               });
    }

    return { 
        podaci, setPodaci, 
        podaciSeCekaju, setPodaciSeCekaju, 
        greska, setGreska, 
        upakujZahtev, uputiZahtevKaBazi 
    };
}

export default useFetch;