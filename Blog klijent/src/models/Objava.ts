import { Komentar } from "./Komentar";
import { Tag } from "./Tag";

export interface Objava
{
    id: number,
    URLNaslovneSlike: string,
    naslov: string,
    kratakOpis: string,
    sadrzaj: string,
    id_autora: number,
    korisnickoIme: string,
    tagovi: Tag[],
    komentari: Komentar[],
    brojKomentara: number,
    brojLajkova: number,
    brojDislajkova: number,
    datumPisanja: string
}