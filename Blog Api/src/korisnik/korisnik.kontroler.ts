import { Korisnik } from "./korisnik.model";
import { Request, Response } from "express";
import { QueryError } from "mysql2";
import { 
    azuirajNaslovnuSlikuUBazi,
    banujKorisnikaUBazu, 
    odblokirajKorisnikaIzBaze, 
    pretraziKorisnikaIzBaze, 
    proveriBanovanjeZaKorisnikaIzBaze, 
    upisiKorisnikaUBazu, 
    vratiBanovaneKorisnikeIzBaze, 
    vratiKorisnickeSlikeIzBaze, 
    vratiKorisnikaIzBaze,
    vratiSveKorisnikeIzBaze 
} from "./korisnik.servis";

export function hendlujPrijavu(request: Request<{}, {}, Korisnik>, response: Response)
{
    const { body: podaciZaPrijavu } = request;
    const ishodPrijave = vratiKorisnikaIzBaze(podaciZaPrijavu.korisnickoIme);
    ishodPrijave.then((korisnik: Korisnik) => {
        if(!korisnik)
        {
            response.status(404);
            response.statusMessage = "Nepostojece korisnicko ime";
            response.send();
        }

        if(korisnik.lozinka !== podaciZaPrijavu.lozinka)
        {
            response.statusMessage = "Lozinka je netacna";
            return response.status(401).send();
        }

        response.status(200).send(korisnik);
    });
}

export function hendlujPravljenjeNaloga(request: Request<{}, {}, Korisnik>, response: Response)
{
    const { body: podaciZaPrijavu } = request;
    
    const ishodPravljenjaNaloga = upisiKorisnikaUBazu(podaciZaPrijavu);
    ishodPravljenjaNaloga.then((odgovor) => {
        response.status(200).send({uspesnoPravljenje: true});
    })
    .catch((greska: QueryError) => {
        if(greska.code === "ER_DUP_ENTRY")
        {
            response.statusMessage = greska.code;
            response.status(400).send();
        }
        else
            response.sendStatus(200);
    });
}

export function pretraziKorisnika(request: Request, response: Response)
{
    const { body: pojamZaPretragu } = request;
    const ishodPretrage = pretraziKorisnikaIzBaze(pojamZaPretragu.korisnickoIme);
    ishodPretrage.then((podaci) => {
        response.status(200).send(podaci);
    }).catch((greska) => {
        response.status(400).send(greska);
    });
}

export function vratiSveKorisnike(request: Request, response: Response)
{
    const sviKorisnici = vratiSveKorisnikeIzBaze();
    sviKorisnici.then((korisnici) => {
        response.status(200).send(korisnici);
    }).catch((greska) => {
        response.status(400).send(greska);
    });
}

export function vratiBanovaneKorisnike(request: Request, response: Response)
{
    const banovaniKorisnici = vratiBanovaneKorisnikeIzBaze();
    banovaniKorisnici.then((banovaniKorisnici) => {
        response.status(200).send(banovaniKorisnici);
    }).catch((greska) => {
        response.status(400).send(greska);
    });
}

export function banujKorisnika(request: Request, response: Response)
{
    const { body: korisnickiPodaci } = request;
    const ishodPostavljanaStatusa = banujKorisnikaUBazu(korisnickiPodaci.idKorisnika, korisnickiPodaci.razlog);
    ishodPostavljanaStatusa.then((ishod) => {
        response.status(200).send({uspesnaIzmena: true});
    }).catch((greska) => {
        response.status(400).send(greska);
    });
}

export function odblokirajKorisnika(request: Request, response: Response)
{
    const { body: korisnickiPodaci } = request;
    const ishodOdblokiranja = odblokirajKorisnikaIzBaze(korisnickiPodaci.idKorisnika);
    ishodOdblokiranja.then((ishod) => {
        response.status(200).send({uspesnaIzmena: true});
    }).catch((greska) => {
        response.status(400).send(greska);
    });
}

export function proveriBanovanjeZaKorisnika(request: Request, response: Response)
{
    const { korisnickoIme } = request.params;
    const ishodBanovanja = proveriBanovanjeZaKorisnikaIzBaze(korisnickoIme);
    ishodBanovanja.then((podaci) => {
        response.status(200).send(podaci);
    }).catch((greska) => {
        console.error(greska);
        response.status(400).send(greska);
    });
}

export function vratiKorisnickeSlike(request: Request, response: Response)
{
    const { korisnickoIme } = request.params;
    const ishodSlika = vratiKorisnickeSlikeIzBaze(korisnickoIme);
    ishodSlika.then((podaci) => {
        response.status(200).send(podaci);
    }).catch((greska) => {
        console.error(greska);
        response.status(400).send({neValja: true});
    });
}

// prvo muuulter treba da uradi posao, onda dobijem URL
// export function azurirajNaslovnuSliku(request: Request, response: Response)
// {
//     const { korisnickoIme } = request.params;
//     const ishodAzuriranja = azuirajNaslovnuSlikuUBazi(korisnickoIme, novaPutanjaDoSlike);
//     ishodAzuriranja.then((podaci) => {
//         console.log(podaci);
//         response.sendStatus(200);
//     }).catch((greska) => {
//         console.error(greska);
//         response.sendStatus(400);
//     });
// }