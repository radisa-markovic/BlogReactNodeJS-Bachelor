import { NextFunction } from "express";
import { QueryError, ResultSetHeader, RowDataPacket } from "mysql2";
import { Komentar } from "../komentari/komentar.model";
import { vratiKomentareIzBaze } from "../komentari/komentar.servis";
import { uspostaviKonekciju } from "../servisneStvari";
import { Tag } from "../tagovi/Tag.model";
import { dodajTagoveNovojObjaviUBazu, vratiTagoveNaObjavi } from "../tagovi/tag.servis";
import { Objava } from "./objava.model";

export function upisiObjavuUBazu(novaObjava: Objava): Promise<any>
{
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();

        const upit: string = `INSERT INTO objave(naslov, URLNaslovneSlike, kratakOpis, sadrzaj, id_autora, datumPisanja) 
            VALUES (?, ?, ?, ?, ?, ?);`

        const nizParametara = [
            novaObjava.naslov,
            novaObjava.URLNaslovneSlike,
            novaObjava.kratakOpis,
            novaObjava.sadrzaj,
            novaObjava.id_autora,
            novaObjava.datumPisanja
        ];

        //     VALUES ("${novaObjava.naslov}", "${novaObjava.URLNaslovneSlike}", "${novaObjava.kratakOpis}", "${novaObjava.sadrzaj}", ${novaObjava.id_autora}, "${novaObjava.datumPisanja}");`
        konekcijaKaBazi.query(upit, nizParametara, (greska: any, rezultat: ResultSetHeader) => {
            if(greska)
            {
                reject(greska);
                return;
            }
    
            /*======= SAD IDE UBACIVANJE TAGOVA, ako ih ima =========*/
            const idNoveObjave = rezultat.insertId;
            if(novaObjava.tagovi.length !== 0)
            {
                const ishodUbacivanja: Promise<any> = dodajTagoveNovojObjaviUBazu(idNoveObjave, novaObjava.tagovi);
                ishodUbacivanja.then((odgovor) => {
                    odgovor.idNovoubaceneObjave = idNoveObjave;
                    resolve(odgovor);
                })
                .catch((greska) => {
                    console.log(greska);
                });
            }
            else
            {
                let odgovor = {
                    idNovoubaceneObjave: idNoveObjave   
                };
                resolve(odgovor);    
            }
        }); 
    });
}

export function vratiSveObjaveIzBaze(brojElemenataPoStranici: number, pomeraj: number, korisnickoIme: string, najnovijePrvo: string, idjeviObjavaPodTagom: number[]): Promise<any>
{
    /*===== 
        ako je korisnicko ime = "-", onda ne trazim objave za specificnog korisnika,                  nnnnnnnnnnnnn\n\\\\\\\\]]


        5u88790 2q  -\  
        vec sve objave iz baze
    =====*/

    // mora prvo tagovee da izvrsim u kontoleru, ona ovo ide ko midlewarrer, pa da u 
    // reequest trpaam one idjeve,  da ovo zna gde da ide
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();
        const upit: string = `
        SELECT objave.id, DATE_FORMAT(objave.datumPisanja, "%d-%m-%Y") AS datumPisanja, objave.naslov, 
        objave.kratakOpis, objave.URLNaslovneSlike, korisnici.korisnickoIme, 
        (SELECT COUNT(*) FROM objave ${ korisnickoIme !== "-"? "WHERE korisnickoIme = \"" + "\"" : " "}) AS brojObjava 
        FROM objave INNER JOIN korisnici ON objave.id_autora = korisnici.id
        ${korisnickoIme !== "-" ? " WHERE korisnici.korisnickoIme = \"" + korisnickoIme + "\"" : ""} 
        ${vratiUslovPoIdjuObjave(idjeviObjavaPodTagom)}
        ORDER BY datumPisanja ${najnovijePrvo === "true"? "DESC" : "ASC"}
        LIMIT ${brojElemenataPoStranici} OFFSET ${pomeraj};`;

        konekcijaKaBazi.query(upit, (greska: QueryError, rezultat: Objava[]) => {
            if(greska)
            {
                reject(greska);
            }
            else
            {
                resolve(rezultat);
            }
            /*========== DODAVANJE TAGOVA OBJAVI =============*/
            /*=== ne da ce ovo da bude ruzno, jer ne mogu resolve dok forEach ne zavrsi,
                  nego ce biti preruzno, posto opet cu vratim Promise
            ===*/

            // const nizPromisa: Promise<any>[] = [];

            // rezultat.forEach((objava) => {
            //     objava.tagovi = [];
            //     nizPromisa.push(
            //         vratiTagoveNaObjavi(objava.id).then((tagoviNaObjavi: Tag[]) => {
            //             tagoviNaObjavi.forEach((tag) => {
            //                 objava.tagovi.push({
            //                     id: tag.id,
            //                     naziv: tag.naziv
            //                 });
            //             });

            //             return objava;
            //         })
            //     );
            // });


            /*========= OVDE SAD IMAM OBJAVE SA TAGOVIMA, I SAD HOCU DA IM UZMEM KOMENTARE ===========*/
            // Promise.all(nizPromisa).then((popunjeneObjave) => {
            //     const nizPromisa: Promise<any>[] = [];

            //     rezultat.forEach((objava) => {
            //         objava.komentari = [];
            //         objava.brojKomentara = 0;
            //         nizPromisa.push(
            //             vratiBrojReakcijaIKomentara(objava.id).then((interakcijeSaObjavom: any) => {
            //                 objava.brojKomentara = interakcijeSaObjavom[0].brojKomentara;
            //                 objava.brojReakcija = interakcijeSaObjavom[0].brojReakcija;
            //                 objava.brojLajkova = interakcijeSaObjavom[0].brojLajkova;

            //                 return objava;
            //             })
            //         );
            //     });

            //     Promise.all(nizPromisa).then((objaveSaBrojemKomentara: Objava[]) => {
            //         resolve(popunjeneObjave);
            //     });
            // }).catch((greska) => {
            //     console.log(greska);
            //     reject(greska);
            // });
        });
    });
}

function vratiUslovPoIdjuObjave(idjeviObjavaPodTagom: number[]): string
{
    if(idjeviObjavaPodTagom.length === 0)
        return "";

    // if(idjeviObjavaPodTagom.length === 0)
    //     return "";
    return "WHERE objave.id IN (" + idjeviObjavaPodTagom.join() + ")";
}

export function dodajBrojLajkovaIDislajkova(request: any, response: any, next: NextFunction)
{
    const konekcija = uspostaviKonekciju();

    const upit = `
        SELECT objave.id,
            SUM(CASE WHEN reakcije_na_objavama.lajk = 1 THEN 1 ELSE 0 END) AS brojLajkova,
            SUM(CASE WHEN reakcije_na_objavama.lajk = 0 THEN 1 ELSE 0 END) AS brojDislajkova
        FROM objave INNER JOIN reakcije_na_objavama
        ON objave.id = reakcije_na_objavama.idObjave
        WHERE objave.id IN (${request.idjeviObjava})
        GROUP BY objave.id;
    `;

    konekcija.query(upit, (greska: QueryError, lajkIDislajkPoObjavi: [{id: number, brojLajkova: number, brojDislajkova: number}]) => {
        if(greska)
        {
            response.status(400).send({neValja: true});
        }
        else
        {
            request.objave.forEach((objava: Objava) => {
                objava.brojLajkova = 0;
                objava.brojDislajkova = 0;
                
                lajkIDislajkPoObjavi.forEach((lajkIDislajk) => {
                    if(lajkIDislajk.id === objava.id)
                    {
                        objava.brojLajkova = lajkIDislajk.brojLajkova;
                        objava.brojDislajkova = lajkIDislajk.brojDislajkova;
                    }
                });
            });

            response.status(200).send(request.objave);
        }
    });
}

export function vratiObjavuIzBaze(idObjave: number): Promise<any>
{
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();
        
        const upit: string = `
        SELECT *, 
               (SELECT COUNT(*) FROM reakcije_na_objavama WHERE idObjave=${idObjave}) as brojReakcija,
               (SELECT COUNT(*) FROM reakcije_na_objavama WHERE idObjave=${idObjave} AND lajk=1) as brojLajkova
        FROM objave INNER JOIN korisnici ON objave.id_autora = korisnici.id
        WHERE objave.id=${idObjave};
        `;

        
        konekcijaKaBazi.query(upit, (greska: QueryError, objava: Objava[]) => {
            if(greska)
                reject(greska);

            //@ts-ignore
            objava[0].brojDislajkova = objava[0].brojReakcija - objava[0].brojLajkova;   
            objava[0].tagovi = [];
            objava[0].komentari = [];
            /*============ DODAVANJE POTENCIJALNIH TAGOVA IZ BAZE ==================*/
            const tagoviIzServisa = vratiTagoveNaObjavi(idObjave);
            tagoviIzServisa.then((tagoviNaObjavi: Tag[]) => {
                
                tagoviNaObjavi.forEach((tag) => {
                    objava[0].tagovi.push({
                        id: tag.id, 
                        naziv: tag.naziv
                    });
                })

                /*====== MORA 0 JER OVO VRACA NIZ OBJEKATA, A MENE ZANIMA PRVI =======*/

                /*============ DODAVANJE POTENCIJALNIH KOMENTARA IZ BAZE ==================*/
                const komentariIzServisa = vratiKomentareIzBaze(idObjave);
                komentariIzServisa.then((komentari: Partial<Komentar>[]) => {
                    komentari.forEach((komentar) => {
                        objava[0].komentari.push({ 
                            idKomentara: komentar.idKomentara,
                            sadrzaj: komentar.sadrzaj,
                            korisnickoIme: komentar.korisnickoIme
                        });
                    });
                    console.log(objava[0]);
                    resolve(objava[0]);
                })
                .catch((greska) => {
                    reject(greska);
                });
            })
            .catch((greska) => {
                reject(greska);
            });
        });
    });
}

export function vratiKorisnikoveObjaveIzBaze(korisnickoIme: string): Promise<any>
{
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();
            
        const upit: string = `
        SELECT korisnici.id AS idKorisnika, korisnickoIme, lozinka, objave.id AS idObjave,
        naslov, kratakOpis, id_autora
        FROM korisnici INNER JOIN objave ON korisnici.id = objave.id_autora
        WHERE korisnickoIme='${korisnickoIme}';`;

        konekcijaKaBazi.query(upit, (greska: QueryError, rezultat: RowDataPacket[]) => {
            if(greska)
                reject(greska);

            resolve(rezultat);    
        });
    });
}

export function vratiBrojReakcijaIKomentara(idObjave: number): Promise<any>
{
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();
        const upit: string = `
        SELECT (SELECT COUNT(*) FROM komentari WHERE idObjave=${idObjave}) as brojKomentara,
        (SELECT COUNT(*) FROM reakcije_na_objavama WHERE idObjave=${idObjave}) as brojReakcija,
        (SELECT COUNT(*) FROM reakcije_na_objavama WHERE idObjave=${idObjave} AND lajk=1) as brojLajkova;
        `;

        konekcijaKaBazi.query(upit, (greska: QueryError, rezultat: RowDataPacket[]) => {
            if(greska)
                reject(greska);

            resolve(rezultat);    
        });
    });
}

export function vratiObjavePodTagomIzBaze(nazivTaga: string): Promise<any>
{
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();
 
        const upit: string = `
            SELECT objave.id, objave.URLNaslovneSlike, objave.naslov, objave.sadrzaj, objave.kratakOpis, korisnici.korisnickoIme 
            FROM objave INNER JOIN tagovi_na_objavama ON objave.id = tagovi_na_objavama.idObjave
                        INNER JOIN tagovi ON tagovi.id = tagovi_na_objavama.idTaga
                        INNER JOIN korisnici ON korisnici.id = objave.id_autora
            WHERE tagovi.naziv = "${nazivTaga}";
        `;

        konekcijaKaBazi.query(upit, (greska: QueryError, rezultat: Objava[]) => {
            if(greska)
                reject(greska);

            resolve(rezultat);
        });

    });
}

export function vratiReakcijuNaObjavuIzBaze(idObjave: number, idKorisnika: number): Promise<any>
{
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();
     
        const upit: string = `
            SELECT *
            FROM reakcije_na_objavama
            WHERE idObjave=${idObjave} AND idKorisnika=${idKorisnika};
        `;

        konekcijaKaBazi.query(upit, (greska: QueryError, rezultat: RowDataPacket[]) => {
            if(greska)
            {
                reject(greska);
            }
            else
            {
                if(rezultat.length === 0)
                    reject(rezultat);
                else
                    resolve(rezultat[0]);
            }

        });
    });
}

// export function lajkujObjavuUBazi(idObjave: number, idKorisnika: number, reakcija: number): Promise<any>
// {
//     return new Promise((resolve, reject) => {
//         const konekcijaKaBazi = uspostaviKonekciju();
//         const upit: string = `
//             INSERT INTO reakcije_na_objavama(idObjave, idKorisnika, lajk)
//             VALUES(${idObjave}, ${idKorisnika}, ${reakcija});
//         `;

//         konekcijaKaBazi.query(upit, (greska: QueryError, rezultat: RowDataPacket[]) => {
//             if(greska)
//             {
//                 reject(greska);
//             }
//             else
//             {
//                 resolve(rezultat);
//             }
//         });
//     });
// }

export function reagujNaObjavuUBazu(idObjave: number, idKorisnika: number, reakcija: number): Promise<any>
{
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();
        const upit: string = `
            INSERT INTO reakcije_na_objavama(idObjave, idKorisnika, lajk)
            VALUES(${idObjave}, ${idKorisnika}, ${reakcija});
        `;

        konekcijaKaBazi.query(upit, (greska: QueryError, rezultat: RowDataPacket[]) => {
            if(greska)
            {
                if(greska.code === "ER_DUP_ENTRY")
                {
                    let upitProvere: string = `
                        SELECT lajk
                        FROM reakcije_na_objavama
                        WHERE idObjave = ${idObjave} AND idKorisnika = ${idKorisnika};
                    `;

                    konekcijaKaBazi.query(upitProvere, (greska: QueryError, rezultat: RowDataPacket[]) => {
                        const reakcijaIzBaze = rezultat[0].lajk.readInt8(0);
                        if(reakcijaIzBaze === reakcija)
                        {
                            let upitBrisanja = `
                                DELETE FROM reakcije_na_objavama
                                WHERE idObjave = ${idObjave} AND idKorisnika = ${idKorisnika};
                            `;      
                            
                            konekcijaKaBazi.query(upitBrisanja, (greska: QueryError, rezultat: RowDataPacket[]) => {
                                resolve(rezultat);
                            });
                        }
                        else
                        {
                            let upitAzuriranja = `
                                UPDATE reakcije_na_objavama
                                SET lajk = ${reakcija}
                                WHERE idObjave = ${idObjave} AND idKorisnika = ${idKorisnika};
                            `;

                            konekcijaKaBazi.query(upitAzuriranja, (greska: QueryError, rezultat: RowDataPacket[]) => {
                                resolve(rezultat);
                            });
                        }
                    });
                }
                else
                {
                    reject(greska);
                }
            }
            else
            {
                resolve(rezultat);
            }
        });
    });
}

export function vratiLajkovaneObjaveIzBaze(korisnickoIme: string): Promise<any>
{
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();
        const upit: string = `
        SELECT *, 
            (SELECT COUNT(*) 
             FROM reakcije_na_objavama 
             WHERE idObjave IN (
                SELECT idObjave 
                FROM reakcije_na_objavama INNER JOIN korisnici ON reakcije_na_objavama.idKorisnika=korisnici.id
                WHERE korisnickoIme='${korisnickoIme}'
                GROUP BY(idObjave)
                )
            ) as brojReakcija
        FROM reakcije_na_objavama INNER JOIN korisnici ON reakcije_na_objavama.idKorisnika = korisnici.id
                                           INNER JOIN objave ON reakcije_na_objavama.idObjave = objave.id
        WHERE lajk=1 AND korisnickoIme='${korisnickoIme}';
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

export function vratiDislajkovaneObjaveIzBaze(korisnickoIme: string): Promise<any>
{
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();
        const upit: string = `
        SELECT * FROM reakcije_na_objavama INNER JOIN korisnici ON reakcije_na_objavama.idKorisnika = korisnici.id
                                           INNER JOIN objave ON reakcije_na_objavama.idObjave = objave.id
        WHERE lajk=0 AND korisnickoIme='${korisnickoIme}';
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

export function pretraziObjaveIzBaze(naslov: string)
{
    return new Promise((resolve, reject) => {
        const konekcija = uspostaviKonekciju();
        const upit = `
            SELECT * 
            FROM objave
            WHERE naslov LIKE "%${naslov}%";
        `;

        konekcija.query(upit, (greska: QueryError, rezultati: RowDataPacket[]) => {
            if(greska)
            {
                reject(greska);
            }
            else
            {
                const nasloviObjava = rezultati.map((rezultat) => new Object({ naslov: rezultat.naslov, id: rezultat.id}));
                resolve(nasloviObjava);
            }
        });
    });
}

export function vratiSlikeSaObjaveIzBaze(idObjave: number)
{
    return new Promise((resolve, reject) => {
        const konekcija = uspostaviKonekciju();
        const upit = `
        SELECT id, urlSlike 
        FROM slike_po_objavama 
        WHERE idObjave=${idObjave}
        ORDER BY id ASC;`;

        konekcija.query(upit, (greska: QueryError, rezultati: RowDataPacket[]) => {
            if(greska)
            {
                reject(greska);
            }
            else
            {
                resolve(rezultati);
            }
        });
    });
}

export function vratiPreporuceneObjaveIzBaze(tipPreporuke: string)
{
    return new Promise((resolve, reject) => {
        const konekcija = uspostaviKonekciju();
        const upit = vratiKriterijumFiltriranja(tipPreporuke);

        konekcija.query(upit, (greska: QueryError, rezultati: RowDataPacket[]) => {
            if(greska)
            {
                reject(greska);
            }
            else
            {
                resolve(rezultati);
            }
        });
    });
}

function vratiKriterijumFiltriranja(tipPreporuke: string): string
{
    if(tipPreporuke === "najkomentarisaniji")
    {
        const upit = `
            SELECT objave.id, objave.naslov, objave.kratakOpis, objave.sadrzaj, objave.URLNaslovneSlike, COUNT(komentari.id) AS brojKomentara
            FROM objave INNER JOIN komentari ON objave.id = komentari.idObjave
            GROUP BY objave.id
            ORDER BY brojKomentara DESC
            LIMIT 5;
        `;

        return upit;
    }

    if(tipPreporuke === "najviseLajkova")
    {
        const upit = `
            SELECT *, COUNT(idObjave) AS brojLajkova
            FROM objave INNER JOIN reakcije_na_objavama
            ON objave.id = reakcije_na_objavama.idObjave
            WHERE lajk='1'
            GROUP BY idObjave
            ORDER BY brojLajkova DESC
            LIMIT 5;
        `;

        return upit;
    }

    return "SELECT * FROM objave ORDER BY RAND() LIMIT 5";
}

export function obrisiObjavuIzBaze(idObjave: number)
{
    return new Promise((resolve, reject) => {
        const konekcija = uspostaviKonekciju();
        const upitZaBrisanje = `
            DELETE 
            FROM objave
            WHERE id=${idObjave};
        `;

        konekcija.query(upitZaBrisanje, (greska: QueryError, rezultati: RowDataPacket[]) => {
            if(greska)
            {
                reject(greska);
            }
            else
            {
                resolve(rezultati);
            }
        });
    });
}

export function azurirajObjavuUBazi(idObjave: number, objava: Objava)
{
    return new Promise((resolve, reject) => {
        const upit = `
            UPDATE objave
            SET naslov = '${objava.naslov}', sadrzaj = '${objava.sadrzaj}', kratakOpis = '${objava.kratakOpis}'
            WHERE id = ${idObjave};
        `;
        const konekcija = uspostaviKonekciju();

        konekcija.query(upit, (greska, rezultati) => {
            if(greska)
            {
                reject(greska);
            }
            else
            {
                resolve(rezultati);
            }
        });
    });
}