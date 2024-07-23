import React, { FC, useState } from "react";
import { OZNACI_PORUKU_PROCITANOM } from "../../ApiPutanje";
import { Poruka } from "../../models/Poruka";
import { vratiDatumPisanja } from "../../ServisneStvari";

interface Props
{
    poruka: Poruka;
    odgovoriNaPoruku: Function,
    tipPrikazanihPoruka: string
}

function PorukaView(props: Props): JSX.Element
{
    const {
        naslov,
        imePosiljaoca,
        datumSlanja,
        sadrzaj
    } = props.poruka;
    const [odgovorSePise, setOdgovorSePise] = useState<boolean>(false);
    const [odgovor, setOdgovor] = useState<string>("");
    const [procitanaPoruka, setProcitanaPoruka] = useState<boolean>();

    return(
        <article className={`poruka kompresovana ${obeleziProcitanuPoruku()}`}>
            <header className="poruka__zaglavlje">
                <h2 className="poruka__naslov">
                    { naslov }
                </h2>
                <span className="poruka__posiljalac">
                    Poslao: { imePosiljaoca }
                </span>
                <time className="poruka__datum-pisanja">
                    Poslato: { datumSlanja }
                </time>
                <button className="poruka__otvori"
                        onClick={(event) => otvoriPoruku(event)}
                >
                    Otvori
                </button>
                <button onClick={(e) => oznaciPorukuProcitanom(e)}
                        style={{ display: props.tipPrikazanihPoruka === "poslatePoruke"? 'none' : 'block' }}
                >
                    Označi pročitanom
                </button>
            </header>
            <div className="poruka__telo">
                <p>
                    { sadrzaj }
                </p>
                { 
                    props.tipPrikazanihPoruka ==="primljenePoruke" && prikaziMogucnostOdgovora()
                }
                
            </div>
        </article>
    );

    function otvoriPoruku(event: React.MouseEvent): void
    {
        const { currentTarget } = event;
        const kontejnerPoruke = currentTarget.closest(".poruka");
        kontejnerPoruke?.classList.toggle("kompresovana");
    }

    function otvoriPoljeZaOdgovor()
    {
        setOdgovorSePise(true);
    }

    /*=== automatski mi je naslov odgovora RE: {prvobitni naslov prijema} ===*/
    function nacrtajPoljeZaOdgovor(): JSX.Element
    {
        return(
            <>
                <textarea name="odgovorNaPoruku" 
                        id="odgovorNaPoruku" 
                        className="kontrola objava__tekst"
                        placeholder="Odgovor..."
                        onChange={(event) => setujOdgovor(event)}
                        cols={30} 
                        rows={10}
                ></textarea>
                <button onClick={() => posaljiOdgovor()}>
                    Pošalji odgovor
                </button>
            </>
        );
    }

    function prikaziMogucnostOdgovora(): JSX.Element
    {
        return(
            <>
                <button className="poruka__posalji objava__dugme"
                        onClick={() => otvoriPoljeZaOdgovor()}
                >
                    Odgovori
                </button>
                { odgovorSePise && nacrtajPoljeZaOdgovor() }
            </>
        );
    }

    function setujOdgovor(event: React.ChangeEvent<HTMLTextAreaElement>): void
    {
        const { value: sadrzajOdgovora } = event.target;
        setOdgovor(sadrzajOdgovora);
    }

    function obeleziProcitanuPoruku(): string
    {
        console.log(props.tipPrikazanihPoruka);
        if(props.tipPrikazanihPoruka === "poslatePoruke")
        {
            return "procitana";
        }

        return props.poruka.procitana.data[0] === 1 ? "procitana" : "neprocitana";
    }

    function posaljiOdgovor()
    {
        const porukaOdgovor: Poruka = {
            id: -1,
            imePosiljaoca: "", /*namesta se u metodi iz propsa*/
            imePrimaoca: props.poruka.imePosiljaoca, /*mora kontra, posto odgovaram*/
            naslov: "RE:" + props.poruka.naslov,
            procitana: false,
            sadrzaj: odgovor,
            datumSlanja: vratiDatumPisanja()
        };

        props.odgovoriNaPoruku(porukaOdgovor);
    }

    function oznaciPorukuProcitanom(e: React.MouseEvent<HTMLButtonElement>)
    {
        fetch(OZNACI_PORUKU_PROCITANOM + "/" + props.poruka.id, {
            method: "PATCH", // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then(() => {
            // alert("NJi");
            //@ts-ignore
            e.target.closest(".poruka").classList.remove("neprocitana");
            const msgCounter = document.querySelector(".dugme-broj-neprocitanih-poruka");
            //@ts-ignore
            if(msgCounter)
            {
                //@ts-ignore
                msgCounter.textContent = (+msgCounter.textContent - 1).toString();
            }
            
        }).catch(() => {
            // alert("Ijn");
        });
    }
}

export default PorukaView;