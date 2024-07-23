import { QueryError, RowDataPacket } from "mysql2";
import { uspostaviKonekciju } from "../servisneStvari";
import { Poruka } from "./poruka.model";

export function upisiPorukuUBazu(novaPoruka: Poruka)
{
    return new Promise((resolve, reject) => {

        const konekcijaKaBazi = uspostaviKonekciju();
        const upit: string = `
            INSERT INTO poruke(imePosiljaoca, imePrimaoca, naslov, sadrzaj, datumSlanja, procitana)
            VALUES ('${novaPoruka.imePosiljaoca}', 
                    '${novaPoruka.imePrimaoca}', 
                    '${novaPoruka.naslov}', 
                    '${novaPoruka.sadrzaj}', 
                    STR_TO_DATE('${novaPoruka.datumSlanja}','%Y-%m-%d'),
                    b'0');
            `;
    
        konekcijaKaBazi.query(upit, (greska: QueryError, rezultat: RowDataPacket[]) => {
            if(greska)
            {
                console.log(`Greska iz servisa: ${greska.code}`);
                reject(greska);
            }
    
            resolve(rezultat);
        });
    });
}

export function vratiKorisnikovePorukeIzBaze(korisnickoIme: string, tipPoruke?: string)
{
    return new Promise((resolve, reject) => {
        const konekcijaKaBazi = uspostaviKonekciju();
        let upit: string = `
        SELECT * 
        FROM poruke
        WHERE imePrimaoca="${korisnickoIme}";`
       
        if(tipPoruke)
        {
            if(tipPoruke === "poslatePoruke")
            {
                upit = `
                SELECT * 
                FROM poruke
                WHERE imePosiljaoca="${korisnickoIme}"
                ORDER BY datumSlanja DESC;`
            }
            else
            {
                upit = `
                SELECT * 
                FROM poruke
                WHERE imePrimaoca="${korisnickoIme}"
                ORDER BY datumSlanja DESC;`
            }
        }
            

        konekcijaKaBazi.query(upit, (greska: QueryError, rezultat: RowDataPacket[]) => {
            if(greska)
            {
                console.log(`Greska iz servisa: ${greska.code}`);
                reject(greska);
            }
    
            resolve(rezultat);
        });
    });
}

export function oznaciPorukuProcitanomUBazi(idPoruke: number)
{
    return new Promise((resolve, reject) => {
        const upit: string = `
           UPDATE poruke
           SET procitana = 1 
           WHERE id = ${idPoruke};
        `;

        const konekcijaKaBazi = uspostaviKonekciju();
        konekcijaKaBazi.query(upit, (greska: QueryError, rezultat: RowDataPacket[]) => {
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