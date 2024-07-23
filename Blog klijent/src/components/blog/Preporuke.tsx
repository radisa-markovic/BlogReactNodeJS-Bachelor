import { useEffect, useState } from "react";
import { VRARTI_PREPORUCENE_CLANKE } from "../../ApiPutanje";
import { Objava } from "../../models/Objava";
import { TipoviPreporuka } from "../../models/TipoviPreporuka";
import { uputiPoziv } from "../../ServisneStvari";
import PregledObjave from "./PregledObjave";

interface Props
{
    vrstaPreporuke: TipoviPreporuka,
    preporukaUVrsti: number;
    prijavljenoKorisnickoIme: string
}

export default function Preporuke(props: Props): JSX.Element
{
    const [clanci, setClanci] = useState<Objava[]>([]);

    useEffect(() => {
        uputiPoziv(`${VRARTI_PREPORUCENE_CLANKE}/${props.vrstaPreporuke}`)
        .then((objave) => {
            console.log(objave);
            setClanci(objave);
        }).catch((greska) => {
            alert(greska);
        });
    }, []);

    return (
        <aside className="container preporuke">
            <h2>{ upisiNaslovPreporuka() }</h2>
            <div className="preporuke__holder" style={{ "--broj-preporuka-u-vrsti": props.preporukaUVrsti } as React.CSSProperties }>
                { nacrtajClanke() }
            </div>
        </aside>
    );

    function nacrtajClanke(): JSX.Element[]
    {
        return clanci.map((clanak, indeks) => {
            return <PregledObjave objava={clanak} 
                                  key={indeks} 
                                  adminJePrijavljen={false} /*<--- hard flag, lenj sam da popravljam*/
                                  prijavljeniKorisnikNapisaoObjavu={clanak.korisnickoIme === props.prijavljenoKorisnickoIme}
                   />
        })
    }

    function upisiNaslovPreporuka(): string
    {
        switch(props.vrstaPreporuke)
        {
            case TipoviPreporuka.NAJKOMENTARISANIJI:
                return "Najkomentarisanije objave";
            case TipoviPreporuka.NAJVISE_DISLAJKOVA:
                return "Objave sa najviše dislajkova";
            case TipoviPreporuka.NAJVISE_LAJKOVA:
                return "Najlajkovanije objave";
            case TipoviPreporuka.NASUMICE:
                return "Izdvajamo:";
            default:
                return "Neke od objava";
        }
    }
}