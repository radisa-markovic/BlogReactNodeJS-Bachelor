import { QueryError, RowDataPacket } from "mysql2";
import { uspostaviKonekciju } from "../servisneStvari";
import { Korisnik } from "./korisnik.model";

export function vratiKorisnikaIzBaze(korisnickoIme: string): Promise<any>
{
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();
        /*=== admin status, paziti na camelCase ===*/
        const upit: string = `
        SELECT id, korisnickoIme, lozinka, BIN(admin_status) AS admin_status,  IFNULL((
            SELECT COUNT(*)
            FROM poruke
            WHERE imePrimaoca='${korisnickoIme}' AND procitana = 0
            GROUP BY imePrimaoca
        ), 0) AS brojNeprocitanihPoruka
        FROM korisnici
        WHERE korisnickoIme='${korisnickoIme}'
        `;
        
        konekcijaKaBazi.query(upit, (greska: QueryError, rezultat: RowDataPacket[]) => {
            if(greska)
                reject(greska);
    
            console.log(rezultat[0])
            resolve(rezultat[0]);
        });
    });    
}

export function upisiKorisnikaUBazu(noviKorisnik: Korisnik): Promise<any>
{
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();
       
        const upitZaUpis: string = `
            INSERT INTO korisnici (korisnickoIme, lozinka) 
            VALUES ('${noviKorisnik.korisnickoIme}', '${noviKorisnik.lozinka}')`;

        konekcijaKaBazi.query(upitZaUpis, (greska: QueryError, rezultat: RowDataPacket[]) => {
            if(greska)
            {
                console.log(`Greska iz servisa: ${greska.code}`);
                reject(greska);
            }
            resolve(rezultat);
        });
        
    });
}

export function pretraziKorisnikaIzBaze(pojamZaPretragu: string)
{
    return new Promise((resolve, reject) => {
        const konekcija = uspostaviKonekciju();
        const upit = `
            SELECT korisnickoIme 
            FROM korisnici
            WHERE korisnickoIme LIKE "%${pojamZaPretragu}%";
        `;

        konekcija.query(upit, (greska: QueryError, rezultati: RowDataPacket[]) => {
            if(greska)
            {
                reject(greska);
            }
            else
            {
                const korisnickaImena = rezultati.map((rezultat) => rezultat.korisnickoIme);
                resolve(korisnickaImena);
            }
        });
    });
}

export function vratiSveKorisnikeIzBaze()
{
    return new Promise((resolve, reject) => {
        const konekcija = uspostaviKonekciju();
        const upit = `
            SELECT id, korisnickoIme 
            FROM korisnici
            WHERE id NOT IN (SELECT idKorisnika FROM banovaniKorisnici);
        `;
       
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

export function vratiBanovaneKorisnikeIzBaze()
{
    return new Promise((resolve, reject) => {
        const konekcija = uspostaviKonekciju();
        const upit = `
        SELECT korisnici.id AS id, korisnickoIme, razlog
        FROM banovaniKorisnici INNER JOIN korisnici ON banovaniKorisnici.idKorisnika = korisnici.id;
        `;
       
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

export function banujKorisnikaUBazu(idKorisnika: number, razlog: string)
{
    return new Promise((resolve, reject) => {
        const konekcija = uspostaviKonekciju();
        const upit = `
            INSERT INTO banovaniKorisnici(idKorisnika, razlog)
            VALUES (${idKorisnika}, '${razlog}');
        `;

        konekcija.query(upit, (greska: QueryError, rezultati: RowDataPacket[]) => {
            if(greska)
            {
                console.log(greska);
                reject(greska);
            }
            else
            {
                resolve(rezultati);
            }
        });
    });
}

export function odblokirajKorisnikaIzBaze(idKorisnika: number)
{
    return new Promise((resolve, reject) => {
        const konekcija = uspostaviKonekciju();
        const upit = `
            DELETE FROM banovaniKorisnici
            WHERE idKorisnika = ${idKorisnika};
        `;

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

export function proveriBanovanjeZaKorisnikaIzBaze(korisnickoIme: string)
{
    return new Promise((resolve, reject) => {
        const konekcija = uspostaviKonekciju();
        const upit = `
            SELECT korisnickoIme, razlog
            FROM banovaniKorisnici INNER JOIN korisnici ON banovaniKorisnici.idKorisnika = korisnici.id
            WHERE korisnickoIme = '${korisnickoIme}';
        `;

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

export function vratiKorisnickeSlikeIzBaze(korisnickoIme: string)
{
    return new Promise((resolve, reject) => {
        const konekcija = uspostaviKonekciju();
        /*NE MOZE INNER, AKO NPR NEMA JOS PROFILNE, NE VRACA NISTA
            videcu dal mozda bolje CROSS JOIN ili nestto ttome slicno
        */
        const upit: string = `
        SELECT (
            SELECT urlNaslovneSlike
            FROM naslovne_slike
            WHERE naslovne_slike.idKorisnika = (
                SELECT id 
                FROM korisnici 
                WHERE korisnickoIme = "${korisnickoIme}"
            )
        ) AS urlNaslovneSlike, (
            SELECT urlProfilneSlike
            FROM profilne_slike
            WHERE profilne_slike.idKorisnika = (
                SELECT id 
                FROM korisnici 
                WHERE korisnickoIme = "${korisnickoIme}"
            )
        ) AS urlProfilneSlike;
        `;

        konekcija.query(upit, (greska: QueryError, rezultati: RowDataPacket[]) => {
            if(greska)
            {
                reject(greska);
            }
            else
            {
                resolve(rezultati[0]);
            }
        });
    });
}

export function azuirajNaslovnuSlikuUBazi(idKorisnika: string, noviURLSlike: string)
{
    return new Promise((resolve, reject) => {
        const konekcija = uspostaviKonekciju();
        const upit = `
            UPDATE slike_na_korisnickoj_stranici
            SET urlNaslovneSlike = "${noviURLSlike}"
            WHERE idKorisnika = ${idKorisnika};
        `;

        konekcija.query(upit, (greska: QueryError, rezultati: RowDataPacket[]) => {
            if(greska)
            {
                console.error(greska);
                reject(greska);
            }
            else
            {
                console.log(rezultati);
                resolve(rezultati);
            }
        });
    });
}