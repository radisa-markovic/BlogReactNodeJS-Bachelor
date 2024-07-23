import { Request, Response } from "express";
import { potvrdiMejlZaPretplatuUBazu, ukloniPretplatuIzBaze } from "./mejl.servis";

export function ukloniPretplatu(request: Request, response: Response)
{
    const { mejl } = request.params;
    const ishodUklanjanja = ukloniPretplatuIzBaze(mejl);
    ishodUklanjanja.then((odgovor) => {
        response.status(200).send(`
            <div style="height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                <h1>Uspešna odjava sa servisa</h1>
                <a href="http://localhost:3000/" style="text-decoration: none; background-color: blue; color: white; display: block; padding: 10px 20px;">
                    Nazad na sajt
                </a>
            </div>
        `);
    }).catch((greska) => {
        response.status(500).send("<h1>Neuspela odjava</h1>");
    });
}

export function potvrdiMejlZaPretplatu(request: Request, response: Response)
{
    const { body } = request;
    const ishodPotvrde = potvrdiMejlZaPretplatuUBazu(body.mejl);
    ishodPotvrde.then((odgovor) => {
        response.status(200).send({uspesnoSlanje: true});
    }).catch((greska) => {
        if(greska.code === 'ER_DUP_ENTRY')
        {
            response.status(400).send({neValja: true});
        }
    });
}