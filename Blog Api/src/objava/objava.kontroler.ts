import { NextFunction, Request, Response } from 'express';
import { azurirajTagove } from '../tagovi/tag.servis';
import { Objava, RequestParamsObjava } from './objava.model';
import { azurirajObjavuUBazi, reagujNaObjavuUBazu, obrisiObjavuIzBaze, pretraziObjaveIzBaze, upisiObjavuUBazu, 
         vratiDislajkovaneObjaveIzBaze, 
         vratiKorisnikoveObjaveIzBaze, 
         vratiLajkovaneObjaveIzBaze, 
         vratiObjavePodTagomIzBaze, 
         vratiObjavuIzBaze, 
         vratiPreporuceneObjaveIzBaze, 
         vratiReakcijuNaObjavuIzBaze, 
         vratiSlikeSaObjaveIzBaze, 
         vratiSveObjaveIzBaze 
       } from './objava.servis';

export function napraviObjavu(request: Request<{}, {}, Objava>, response: Response, next: NextFunction)
{
    const { body: novaObjava } = request;
    const upisObjave = upisiObjavuUBazu(novaObjava);
    upisObjave.then((odgovor) => {
        //@ts-ignore
        request.naslovObjave = novaObjava.naslov;
       
        next();

        response.status(200).json({
            idNoveObjave: odgovor.idNovoubaceneObjave,
            uspesnoPravljenje: true
        });
    })
    .catch((greska) => {
        response.status(400).send({
            neValja: true
        });
    });   
}

export function vratiSveObjave(request: Request<RequestParamsObjava,{},{},{}>, response: Response, next: NextFunction)
{
    const { brojElemenataPoStranici, pomeraj, korisnickoIme, najnovijePrvo } = request.params;    
    //@ts-ignore
    const objaveIzBaze = vratiSveObjaveIzBaze(parseInt(brojElemenataPoStranici), parseInt(pomeraj), korisnickoIme, najnovijePrvo, request.idjeviObjavaPodTagom);
    objaveIzBaze.then((objave: Objava[]) => {
        //@ts-ignore
        request.objave = objave;
        next();
        // response.status(200).send(objave);
    })
    .catch((greska) => {
        console.error(greska);
    });
}

export function vratiJednuObjavu(request: Request, response: Response)
{
    const { id } = request.params;
    
    const objavaIzBaze = vratiObjavuIzBaze(parseInt(id));
    objavaIzBaze.then((objava) => {
        response.status(200).send(objava);
    })
    .catch((greska) => {
        console.error(greska);
    });
}

export function vratiKorisnikoveObjave(request: Request, response: Response)
{
    const { korisnickoIme } = request.params;
    const korisnikoveObjave = vratiKorisnikoveObjaveIzBaze(korisnickoIme);
    korisnikoveObjave.then((korisnikoveObjave) => {
        response.status(200).send(korisnikoveObjave);
    });
}

export function vratiSveObjavePodTagom(request: Request, response: Response)
{
    const { nazivTaga } = request.params;
    const objavePodTagom = vratiObjavePodTagomIzBaze(nazivTaga);
    objavePodTagom.then((objavePodTagom) => {
        response.status(200).send(objavePodTagom);
    })
    .catch((greska) => {
        console.error(greska);
        response.sendStatus(400);
    });
}

export function vratiReakcijuNaObjavu(request: Request, response: Response)
{
    const { body } = request;
    const { idObjave } = request.params;
    const reakcijaNaObjavu = vratiReakcijuNaObjavuIzBaze(parseInt(idObjave), body.idKorisnika);
    reakcijaNaObjavu.then((podaci) => {
        response.status(200).send(podaci);
    })
    .catch((greska) => {
        console.error(greska);
        response.status(400).send({nemaReakcije: true});
    });
}

// export function lajkujObjavu(request: Request, response: Response)
// {
//     const { idObjave } = request.params;
//     const { body } = request;

//     const odgovorIzBaze = lajkujObjavuUBazi(parseInt(idObjave), body.idKorisnika, body.reakcija);
//     odgovorIzBaze.then((odgovor) => {
//         response.status(200).send({uspesnoDodavanje: true});
//     })
//     .catch((greska) => {
//         console.error(greska);
//         response.status(400).send({uspesnoDodavanje: false});
//     });
// }

// export function dislajkujObjavu(request: Request, response: Response)
// {
//     const { idObjave } = request.params;
//     const { body } = request;

//     const odgovorIzBaze = reagujNaObjavuUBazu(parseInt(idObjave), body.idKorisnika, body.reakcija);
//     odgovorIzBaze.then((odgovor) => {
//         response.status(200).send({uspesnoDodavanje: true});
//     })
//     .catch((greska) => {
//         console.error(greska);
//         response.status(400).send({uspesnoDodavanje: false});
//     });
// }

export function reagujNaObjavu(request: Request, response: Response)
{
    const { idObjave } = request.params;
    const { body } = request;

    const odgovorIzBaze = reagujNaObjavuUBazu(parseInt(idObjave), body.idKorisnika, body.reakcija);
    odgovorIzBaze.then((odgovor) => {
        response.status(200).send({uspesnoDodavanje: true});
    }).catch((greska) => {
        console.error(greska);
        response.status(400).send({uspesnoDodavanje: false});
    });
}

export function vratiLajkovaneObjave(request: Request, response: Response)
{
    const { korisnickoIme } = request.params;
    const sviKorisnikoviKomentari = vratiLajkovaneObjaveIzBaze(korisnickoIme);
    sviKorisnikoviKomentari.then((lajkovaniPostovi) => {
        response.status(200).send(lajkovaniPostovi);
    })
    .catch((greska) => {
        console.error(greska);
        response.status(400).send({nemaLajkovanihObjava: true});
    }); 
}

export function vratiDislajkovaneObjave(request: Request, response: Response)
{
    const { korisnickoIme } = request.params;
    const sviKorisnikoviKomentari = vratiDislajkovaneObjaveIzBaze(korisnickoIme);
    sviKorisnikoviKomentari.then((dislajkovaniPostovi) => {
        response.status(200).send(dislajkovaniPostovi);
    })
    .catch((greska) => {
        console.error(greska);
        response.status(400).send({nemaLajkovanihObjava: true});
    }); 
}

export function pretraziObjavu(request: Request, response: Response)
{
    const { body: pojamZaPretragu } = request;

    const pretrazeneObjave = pretraziObjaveIzBaze(pojamZaPretragu.naslov);
    pretrazeneObjave.then((objave) => {
        response.status(200).send(objave);
    })
    .catch((greska) => {
        response.status(400).send(greska);
    });
}

export function vratiSlikeSaObjave(request: Request, response: Response)
{
    const { idObjave } = request.params;
    const ishodSlika = vratiSlikeSaObjaveIzBaze(parseInt(idObjave));
    ishodSlika.then((urlSlika) => {
        response.status(200).send(urlSlika);
    })
    .catch((greska) => {
        response.status(400).send({imaGreske: true});
    });
}

export function vratiPreporuceneObjave(request: Request, response: Response)
{
    const { tipPreporuke } = request.params;
    const ishodUpita = vratiPreporuceneObjaveIzBaze(tipPreporuke);
    ishodUpita.then((objave) => {
        response.status(200).send(objave);
    }).catch((greska) => {
        response.status(400).send({imaGreske: true});
    });
}

export function obrisiObjavu(request: Request, response: Response)
{
    const { idObjave } = request.params;
    const ishodBrisanja = obrisiObjavuIzBaze(parseInt(idObjave));
    ishodBrisanja.then((podatak) => {
        response.sendStatus(200);
    }).catch((greska) => {
        console.error(greska);
        response.sendStatus(400);
    }); 
}

export function azurirajObjavu(request: Request, response: Response, next: NextFunction)
{
    const { idObjave } = request.params;
    const { body: objava } = request;
    const ishodAzuriranja = azurirajObjavuUBazi(parseInt(idObjave), objava);

    ishodAzuriranja.then((odgovor) => {
        //@ts-ignore
        request.idObjave = idObjave;
        next();   
    }).catch((greska) => {
        response.status(500).send({ok: false});
    });
}