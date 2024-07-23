import { NextFunction, Request, Response } from 'express';
import { QueryError, RowDataPacket } from 'mysql2';
import { uspostaviKonekciju } from '../servisneStvari';
import { NizoviTagovaZaFilter, Tag } from './Tag.model';
import { dodajTagoveNovojObjaviUBazu, ucitajTagoveZaPretraguIzBaze, upisiNoviTagUBazu, vratiSveTagoveIzBaze } from './tag.servis';

export function dodajTag(request: Request<{}, {}, Tag>, response: Response)
{
    const { body: noviTag } = request;
    
    const ishodUpisa = upisiNoviTagUBazu(noviTag.naziv);
    ishodUpisa.then((noviId) => {
        response.status(200).send({ idNovogTaga: noviId });
    })
    .catch((greska) => {
        response.statusMessage = greska.code;
        response.statusCode = 400;
        const greskaObjekat = {
            kodGreske: greska.code
        };

        response.send(greskaObjekat);
    });
}

export function vratiObjaveSaTagom(request: Request, response: Response)
{
    const konekcijaKaBazi = uspostaviKonekciju();
    konekcijaKaBazi.connect((greska) => {
        if(greska)
            throw greska;
    });

    const { nazivTaga } = request.params;
    const upit: string = `
    SELECT * 
    FROM tagovi_na_objavama INNER JOIN tagovi ON tagovi_na_objavama.idTaga = tagovi.id
    INNER JOIN objave ON tagovi_na_objavama.idTaga = objave.id
    WHERE tagovi.naziv = '${nazivTaga}'`;

    konekcijaKaBazi.query(upit, (greska: QueryError, rezultat: RowDataPacket[]) => {
        if(greska)
            throw greska;

        response.statusCode = 200;
        return response.send(rezultat);
    });
}

export function vratiSveTagove(request: Request, response: Response)
{
    const tagoviOdgovor = vratiSveTagoveIzBaze();
    tagoviOdgovor.then((tagovi: Tag[]) => {
        response.status(200).send(tagovi);
    })
    .catch((greska) => {
        console.log(greska);
        response.sendStatus(400);
    });
}

export function ucitajTagoveZaPretragu(request: Request, response: Response)
{
    const tagoviIzBaze = ucitajTagoveZaPretraguIzBaze();
    tagoviIzBaze.then((odgovor) => {
        response.status(200).send(odgovor);
    }).catch((greska) => {
        response.status(400).send({neValja: true})
    });
}
