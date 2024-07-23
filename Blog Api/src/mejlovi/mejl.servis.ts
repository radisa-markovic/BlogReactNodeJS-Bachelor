const nodemailer = require("nodemailer");
import { RowDataPacket } from "mysql2";
import { uspostaviKonekciju } from "../servisneStvari";
import { NextFunction, Request, Response } from 'express';

export function ukloniPretplatuIzBaze(mejl: string)
{
    return new Promise((resolve, reject) => {
        const upit: string = `
            DELETE 
            FROM mejlovi_pretplatnika
            WHERE email = '${mejl}';
        `;
        const konekcija = uspostaviKonekciju();
        
        konekcija.query(upit, (greska, rezultat) => {
            if(greska)
            {
                reject(greska);
            }
            else
            {
                resolve(rezultat);
            }
        });
    });
}

export function potvrdiMejlZaPretplatuUBazu(mejl: string)
{
    return new Promise((resolve, reject) => {
        console.table(mejl);
        const upit: string = `
            INSERT INTO mejlovi_pretplatnika(email)
            VALUES ("${mejl}");
        `;

        const konekcija = uspostaviKonekciju();
        konekcija.query(upit, (greska, rezultat) => {
            if(greska)
            {
                reject(greska);
            }
            else
            {
                resolve(rezultat);
            }
        });
    });
}

/*======= MIDDLEWARE KAD SE NAPRAVI NALOG ========*/
export function posaljiObavestenjePretplatnicima(request: Request, response: Response)
{
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASSWORD
        }
    });

    const upit = `
        SELECT email
        FROM mejlovi_pretplatnika;
    `;

    const konekcija = uspostaviKonekciju();
    konekcija.query(upit, (greska, rezultat: RowDataPacket[]) => {
        if(greska)
        {
            console.error(greska);
        }
        else
        {
            rezultat.forEach((mejl) => {
                transporter.sendMail({
                    from: '"Blog team" <admin@example.com>', // sender address
                    to: mejl.email, // list of receivers
                    subject: "Nova objava", // Subject line
                    text: "Hello", // plain text body
                    html: `
                        <h1>Napravljen je novi clanak: ${(request as any).naslovObjave} </h1>
                        <a href='http://localhost:3002/brisiKorisnika/${mejl.email}'
                           style="display: block; padding: 10px 20px; color: white; 
                                  background-color: black; text-decoration: none; text-align: center;"
                        >
                            Prestani slanje obaveštenja
                        </a>
                    `, // html body
                }).then((odgovor: any) => {
                    console.log(odgovor);
                }).catch((greska: any) => {
                    console.error(greska);
                });
            });
        }
    });

}