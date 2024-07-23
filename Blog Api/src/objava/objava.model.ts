import { Komentar } from "../komentari/komentar.model";
import { Tag } from "../tagovi/Tag.model";

export interface Objava {
    id: number,
    naslov: string,
    URLNaslovneSlike: string;
    kratakOpis: string,
    sadrzaj: string,
    id_autora: string,
    tagovi: Tag[],
    // idjeviTagova: number[], /*na frontu cu da iscrtam tagove sa nazivom i id-jem, da laksi bude prenos*/
    // naziviTagova: string[],
    komentari: Partial<Komentar>[],
    brojKomentara: number,
    brojLajkova: number,
    brojDislajkova: number,
    datumPisanja: string
}

/*tagovi mogu da budu i svoj entitet, ako hocu pretragu po njima, i da ih dodajem*/
/*komentar takodje moze da bude entitet, strani kljuc ce bude od autora sto napisao*/
export interface RequestParamsObjava
{
    brojElemenataPoStranici: string,
    pomeraj: string,
    korisnickoIme: string,
    najnovijePrvo: string
}