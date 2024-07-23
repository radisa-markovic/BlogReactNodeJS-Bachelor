export function upakujZahtev(metoda: string, objekat: object)
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

export function uputiPoziv(URL: string, objekatZahteva?: object): Promise<any>
{
    return fetch(URL, objekatZahteva)
    .then((odgovor: Response) => {        
        if(!odgovor.ok)
        {
            throw odgovor;
        }
        
        return odgovor.json();
    })
}

export function vratiDatumPisanja(): string
{
    let datumPisanja = new Date();
    let dan = datumPisanja.getDate();
    let mesec = datumPisanja.getMonth() + 1;
    let godina = datumPisanja.getFullYear();

    return [godina, mesec, dan].join("-");
}