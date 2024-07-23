import { Request, Response } from "express";
import { Poruka } from "./poruka.model";
import { oznaciPorukuProcitanomUBazi, upisiPorukuUBazu, vratiKorisnikovePorukeIzBaze } from "./poruka.servis";

export function napisiPoruku(request: Request<{}, {}, Poruka>, response: Response)
{
    const { body: novaPoruka } = request;
    const ishodUpisa = upisiPorukuUBazu(novaPoruka);

    ishodUpisa.then((odgovor) => {
        response.status(200).send(odgovor);
    }).catch((greska) => {
        console.log(greska);
        response.status(400).send({javilaSeGreska: true});
    });
}

export function vratiKorisnikovePoruke(request: Request, response: Response)
{
    const { korisnickoIme, tipPoruke } = request.params;
    const ishodCitanja = vratiKorisnikovePorukeIzBaze(korisnickoIme, tipPoruke);
    ishodCitanja.then((poruke) => {
        response.status(200).send(poruke);
    })
    .catch((greska) => {
        console.log(greska);
        response.status(400).send({javilaSeGreska: true});
    });
}

export function oznaciPorukuProcitanom(request: Request, response: Response)
{
    const { idPoruke } = request.params;
    
    const ishodOznacavanja = oznaciPorukuProcitanomUBazi(parseInt(idPoruke));
    ishodOznacavanja.then((odgovor) => {
        response.sendStatus(200);
    }).catch((greska) => {
        response.sendStatus(400);
    });
}