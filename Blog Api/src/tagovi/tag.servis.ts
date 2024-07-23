import { Request, Response, NextFunction } from "express";
import { QueryError, ResultSetHeader, RowDataPacket } from "mysql2";
import { Objava } from "../objava/objava.model";
import { uspostaviKonekciju } from "../servisneStvari";
import { NizoviTagovaZaFilter, Tag } from "./Tag.model";

export function vratiSveTagoveIzBaze(): Promise<any>
{
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();
        // konekcijaKaBazi.connect((greska) => {
        //     if(greska)
        //         reject(greska);
        // });

        const upit: string = `SELECT * FROM tagovi;`;

        konekcijaKaBazi.query(upit, (greska: QueryError, tagovi: RowDataPacket[]) => {
            if(greska)
                reject(greska);

            resolve(tagovi);
        });
    });
}

export function vratiTagoveNaObjavi(idObjave: number): Promise<any>
{
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();
        // konekcijaKaBazi.getConnection((greska) => {
        //     if(greska)
        //         reject(greska);
        // });

        const upitZaTagove: string = `
            SELECT * FROM tagovi WHERE id IN (
                SELECT idTaga FROM objave INNER JOIN tagovi_na_objavama
                ON objave.id=tagovi_na_objavama.idObjave
                WHERE objave.id = ${idObjave}
            );
            `;

        konekcijaKaBazi.query(upitZaTagove, (greska: QueryError, tagoviNaObjavi: Tag[]) => {
            if(greska)
                reject(greska);

            resolve(tagoviNaObjavi);
        });
    });
}

export function upisiNoviTagUBazu(nazivTaga: string): Promise<any>
{
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();
        // konekcijaKaBazi.connect((greska) => {
        //     if(greska)
        //         reject(greska);
        // });

        const upit: string = `INSERT INTO tagovi(naziv) VALUES('${nazivTaga}');`
        konekcijaKaBazi.query(upit, (greska: QueryError, rezultat: ResultSetHeader) => {
            console.log(greska);

            if(greska)
                reject(greska);
            else
            {
                console.log(rezultat);
                rezultat.insertId && console.log(rezultat.insertId);
                resolve(rezultat.insertId);
            }

            // /*======== SAD IDE VRACANJE ID-JA NOVOG TAGA ==========*/
            // const upitIDNovaObjava: string = "SELECT LAST_INSERT_ID();";
            // konekcijaKaBazi.query(upitIDNovaObjava, (greska: QueryError, rezultat: RowDataPacket[]) => {
            //     if(greska)
            //         reject(greska);

            //     const idNovogTaga = Object.values(rezultat[0])[0];
            //     console.log(idNovogTaga);
            //     resolve(idNovogTaga);
            // });
            
        });
    });
}

export function dodajTagoveNovojObjaviUBazu(idObjave: number, tagovi: Tag[]): Promise<any>
{
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();
        // konekcijaKaBazi.connect((greska) => {
        //     if(greska)
        //         reject(greska);
        // });

        let nizTagovaZaBazu: any = [];

        tagovi.forEach((tag) => {
            nizTagovaZaBazu.push([idObjave, tag.id]);
        });
        
        const upit: string = `INSERT INTO tagovi_na_objavama(idObjave, idTaga) VALUES ?;`;

        konekcijaKaBazi.query(upit, [nizTagovaZaBazu], (greska, rezultat, fields) => {
            if(greska)
            {
                throw greska;
            }

            resolve(rezultat);
            // return response.sendStatus(200);
        });

    });
}

export function dodajTagoveObjavama(request: any, response: any, next: NextFunction)
{
    const konekcija = uspostaviKonekciju();
    request.idjeviObjava = [];
    request.objave.forEach((objava: Objava) => {
        objava.tagovi = [];
        request.idjeviObjava.push(objava.id);
    });

    const upit = `
        SELECT idObjave, idTaga, naziv
        FROM tagovi INNER JOIN tagovi_na_objavama ON tagovi.id = tagovi_na_objavama.idTaga
        WHERE idObjave IN (${request.idjeviObjava});
    `;

    konekcija.query(upit, (greska: QueryError, rezultat: [{ idObjave: number, idTaga: number, naziv: string}]) => {
        /*=== O(n2), al bolje ne znam ===*/
        request.objave.forEach((objava: Objava) => {
            rezultat.forEach((rezultat) => {
                if(objava.id === rezultat.idObjave)
                    objava.tagovi.push({
                        id: rezultat.idTaga,
                        naziv: rezultat.naziv
                    });
            });
        });
        
        next();
    });

}

export function ucitajTagoveZaPretraguIzBaze()
{
    return new Promise((resolve, reject) => {
        const konekcija = uspostaviKonekciju();
        const upit = `
            SELECT id, naziv
            FROM tagovi;
        `;

        konekcija.query(upit, (greska: QueryError, rezultat: Tag[]) => {
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

export function vratiObjaveSaTagovima(request: Request<any, any, any, NizoviTagovaZaFilter>, response: Response, next: NextFunction)
{
    const { odabraniTagovi, iskljuceniTagovi } = request.query;
    //@ts-ignore
    request.idjeviObjavaPodTagom = [];

    if(nisuOdabraniTagovi(odabraniTagovi, iskljuceniTagovi))
    {        
        next();
    }
    else
    {
        let nizOdabranihTagova: string[] = [];
        let nizIskljucenihTagova: string[] = [];
    
        if(odabraniTagovi)
        {
            nizOdabranihTagova = odabraniTagovi.split(",");
        }
    
        if(iskljuceniTagovi)
        {
            nizIskljucenihTagova = iskljuceniTagovi.split(",");
        }
    
        const upit: string = `
            SELECT DISTINCT tagovi_na_objavama.idObjave
            FROM tagovi INNER JOIN tagovi_na_objavama ON tagovi.id = tagovi_na_objavama.idTaga
            WHERE ${formirajUsloveSaTagovima(nizOdabranihTagova, nizIskljucenihTagova)};
        `;

        const konekcija = uspostaviKonekciju();
        konekcija.query(upit, (greska: QueryError, indeksiObjava: {idObjave: number}[]) => {
            if(greska)
            {
                response.sendStatus(400);
            }
            else
            {
                if(indeksiObjava.length === 0)
                {
                    response.status(200).send([]);
                    return;
                }

                let idjeviObjava: number[] = [];
                indeksiObjava.forEach((indeksObjekat) => {
                    idjeviObjava.push(indeksObjekat.idObjave);
                });
                //@ts-ignore
                request.idjeviObjavaPodTagom = idjeviObjava;
                next();
            }
        });
    }
}

function nisuOdabraniTagovi(odabraniTagovi: string, iskljuceniTagovi: string)
{
    return !odabraniTagovi && !iskljuceniTagovi;
}

function formirajUsloveSaTagovima(odabraniTagovi: string[], iskljuceniTagovi: string[]): string
{
    let uslovZaTagove: string = "";
    if(odabraniTagovi)
    {
        for(let i=0; i < odabraniTagovi.length; i++)
        {
            uslovZaTagove += ` naziv='${odabraniTagovi[i]}' `;
            if(i !== odabraniTagovi.length - 1)
            {
                uslovZaTagove += " AND ";
            }
        }        
    }

    if(iskljuceniTagovi)
    {
        for(let i=0; i < iskljuceniTagovi.length; i++)
        {
            uslovZaTagove += ` naziv != '${iskljuceniTagovi[i]}' `

            if(i !== iskljuceniTagovi.length - 1)
            {
                uslovZaTagove += " AND ";
            }
        }
    }

    return uslovZaTagove;
}

function tagNijeOdabran(nizTagova: string[]): boolean
{
    return nizTagova.length === 1 && nizTagova[0] === "";
}

export function azurirajTagove(request: Request, response: Response, next: NextFunction)
{
    //@ts-ignore
    const idObjave = request.idObjave;
    const idjeviTagova = request.body.tagovi;

    const upit = `
        DELETE 
        FROM tagovi_na_objavama
        WHERE idObjave = ${idObjave};
    `;

    const konekcija = uspostaviKonekciju();
    konekcija.query(upit, (greska, rezultati) => {
        if(greska)
        {
            console.error("Ne valja brisanje tagova");
            response.status(500).send({neValja: true});
        }
        else
        {
            console.log("Mambole");
            console.log(idObjave);
            console.log(idjeviTagova);
            if(idjeviTagova.length !== 0)
            {
                idjeviTagova.forEach((tag: {id: number, naziv: string}, redniBroj: number) => {
                    let upitZaTag = `
                        INSERT INTO tagovi_na_objavama(idTaga, idObjave)
                        VALUES (${tag.id}, ${idObjave});
                    `;
                    console.log(upitZaTag);

                    konekcija.query(upitZaTag, (greska, rezultati) => {
                        if(redniBroj === idjeviTagova.length)
                        {
                            console.log("Azurirani tagovi");
                            response.status(200).send({dobro: true});
                        }
                    });
                })
            }
            response.status(200).send({dobro: true});
        }
    });
}