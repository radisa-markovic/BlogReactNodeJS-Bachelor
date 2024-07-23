import { NextFunction } from "express";
import { QueryError, RowDataPacket } from "mysql2";
import { Objava } from "../objava/objava.model";
import { uspostaviKonekciju } from "../servisneStvari";
import { Komentar } from "./komentar.model";

export function upisiKomentarUBazu(komentar: Komentar): Promise<any>
{
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();

        const upit: string = `
            INSERT INTO komentari(idAutora, idObjave, sadrzaj)
            VALUES (${komentar.idAutora}, ${komentar.idObjave}, '${komentar.sadrzaj}');
        `;

        konekcijaKaBazi.query(upit, (greska: QueryError, rezultat: RowDataPacket[]) => {
            if(greska)
                reject(greska);

            resolve(rezultat);
        });
    });    
}

export function vratiKomentareIzBaze(idObjave: number): Promise<any>
{
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();
    
        const upit: string = `
            SELECT komentari.sadrzaj, korisnici.korisnickoIme, komentari.id AS idKomentara
            FROM komentari INNER JOIN korisnici ON komentari.idAutora = korisnici.id
            WHERE idObjave=${idObjave};
        `;

        konekcijaKaBazi.query(upit, (greska: QueryError, rezultat: RowDataPacket[]) => {
            if(greska)
                reject(greska);
    
            resolve(rezultat);
        });
    });
}

export function vratiSveKorisnikoveKomentareIzBaze(korisnickoIme: string): Promise<any>
{
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();

        const upit = `
        SELECT objave.naslov, komentari.sadrzaj as komentar  
        FROM komentari INNER JOIN korisnici ON komentari.idAutora = korisnici.id
		        	   INNER JOIN objave ON komentari.idObjave = objave.id
        WHERE korisnickoIme = "${korisnickoIme}";
        `;

        konekcijaKaBazi.query(upit, (greska: QueryError, rezultat: RowDataPacket[]) => {
            if(greska)
            {
                reject(rezultat);
            }
            else
            {
                resolve(rezultat);
            }
        });
    });
}

export function obrisiKomentarUBazi(idKomentara: number)
{
    return new Promise((resolve, reject) => {
        const konekcija = uspostaviKonekciju();
        const upit = `
            DELETE
            FROM komentari
            WHERE id = ${idKomentara};
        `;

        konekcija.query(upit, (greska: QueryError, rezultat: RowDataPacket[]) => {
            if(greska)
            {
                reject(greska);
            }
            else
            {
                resolve(greska);
            }
        });
    });
}

export function dodajBrojKomentara(request: any, response: any, next: NextFunction)
{
    const konekcija = uspostaviKonekciju();
    const upit = `
        SELECT objave.id, COUNT(komentari.id) AS brojKomentara
        FROM objave INNER JOIN komentari
        ON objave.id = komentari.idObjave
        INNER JOIN reakcije_na_objavama
        ON objave.id = reakcije_na_objavama.idObjave
        WHERE objave.id IN (${request.idjeviObjava})
        GROUP BY objave.id;
    `;
    
    
    konekcija.query(upit, (greska: QueryError, rezultat: any) => {
        if(greska)
        {
            response.status(400).send({neValja: true});
        }
        else
        {
            request.objave.forEach((objava: Objava) => {
                objava.brojKomentara = 0;
                rezultat.forEach((rezultat: {id: number, brojKomentara: number}) => {
                    if(objava.id === rezultat.id)
                        objava.brojKomentara = rezultat.brojKomentara; 
                });
            });

            next();
    
            // response.status(200).send(request.objave);
        }
    });
}