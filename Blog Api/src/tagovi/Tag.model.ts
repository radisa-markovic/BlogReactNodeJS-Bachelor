export interface Tag
{
    id: number,
    naziv: string
}

/*=== tagovi odvojeni zarezima ===*/
export interface NizoviTagovaZaFilter
{
    odabraniTagovi: string,
    iskljuceniTagovi: string
}