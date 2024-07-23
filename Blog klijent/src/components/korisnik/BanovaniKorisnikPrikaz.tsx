import { useParams } from "react-router";

export function BanovaniKorisnikPrikaz(): JSX.Element
{
    const { korisnickoIme } = useParams<{korisnickoIme: string}>();
    const { razlog } = useParams<{razlog: string}>();

    return(
        <main className="zabrana container">
            <h1>
                Obaveštenje o zabrani za korisnika: {korisnickoIme}
            </h1>
            <p className="zabrana__paragraf">
                Zabranjeno Vam je prijavljivanje na nalog zbog razloga:
            </p>
            <p className="zabrana__paragraf">
                <em className="zabrana__razlog">{ razlog }</em>
            </p>
            <p className="zabrana__paragraf">
                Sajtu možete da pristupate kao gost bez prijave
            </p>
        </main>
    );
}