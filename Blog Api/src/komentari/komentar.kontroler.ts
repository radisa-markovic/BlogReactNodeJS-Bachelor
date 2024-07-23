import { Request, response, Response } from 'express';
import { Komentar } from "./komentar.model";
import { obrisiKomentarUBazi, upisiKomentarUBazu, vratiKomentareIzBaze, vratiSveKorisnikoveKomentareIzBaze } from "./komentar.servis";

export function dodajKomentarObjavi(request: Request<{}, {}, Komentar>, response: Response)
{
    const { body: noviKomentar } = request;
    const ishodUpisa = upisiKomentarUBazu(noviKomentar);
    ishodUpisa.then((podaci) => {
        response.status(200).send({uspesanUpis: true});
    })
    .catch((greska) => {
        console.error(greska);
        response.send(400).send({uspesanUpis: false});
    });
}

export function vratiKomentareNaObjavi(request: Request, response: Response)
{
    const { idObjave } = request.params;
    const komentariIzBaze = vratiKomentareIzBaze(parseInt(idObjave));
    komentariIzBaze.then((komentari) => {
        response.sendStatus(200);
    })
    .catch((greska) => {
        console.error(greska);
    });    
}

export function vratiSveKorisnikoveKomentare(request: Request, response: Response)
{
    const { korisnickoIme } = request.params;
    const sviKorisnikoviKomentari = vratiSveKorisnikoveKomentareIzBaze(korisnickoIme);
    sviKorisnikoviKomentari.then((komentari) => {
        response.status(200).send(komentari);
    })
    .catch((greska) => {
        console.error(greska);
        response.status(400).send({nemaKomentara: true});
    }); 
}

export function obrisiKomentar(request: Request, response: Response)
{
    const { idKomentara } = request.params;
    const ishodBrisanjaKomentara = obrisiKomentarUBazi(parseInt(idKomentara));
    ishodBrisanjaKomentara.then((odgovor) => {
        response.sendStatus(200);
    }).catch((greska) => {
        response.sendStatus(400);
    });
}