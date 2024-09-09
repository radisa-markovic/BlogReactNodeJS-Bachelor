import React, { useRef, useState } from "react";
// import { useHistory } from "react-router-dom";
import { PRETRAZI_KORISNICKO_IME, PRETRAZI_NASLOV_OBJAVE } from "../ApiPutanje";
import { Poruka } from "../models/Poruka";
import { upakujZahtev, uputiPoziv } from "../ServisneStvari";

interface Props
{
    onChangeHandler: React.ChangeEventHandler<HTMLInputElement>,
    bindingPropertyName: string, /*=== bitno zbog hendlera u komponenti iznad koja koristti ovu ovde ===*/
    setPropertyName: React.Dispatch<React.SetStateAction<Partial<Poruka> | any>>,
    urlPutanja: string,
    placeholder?: string
}

export default function UnosSaPredlozima(props: Props): JSX.Element
{
    const [predlozi, setPredlozi] = useState<any[]>([]);
    const listaPredloga = useRef<HTMLUListElement>(null);
    // const history = useHistory();

    return(
        <div className="kontejner-unosa-sa-predlozima">
            <input type="text" 
                   name={props.bindingPropertyName}
                   className="kontrola" 
                   id="" 
                   autoComplete="off"
                   onChange={(event) => {
                       hendlujPretragu(event);
                       props.onChangeHandler(event);
                    }}
                   placeholder={props.placeholder? props.placeholder : "Unos sa predlozima" }
            />
            <ul className="lista-predloga"
                ref={listaPredloga}
                onClick={(event) => klikNaPredlog(event)}
            >
                { nacrtajPredloge() }
            </ul>
        </div>
    );

    function nacrtajPredloge(): JSX.Element[]
    {
        return predlozi.map((predlog) => {
            if(typeof predlog === 'object' && predlog !== null)
            {
                return(
                    <li className="predlog-kontejner"
                        data-id={predlog.id}
                    >
                        { predlog[props.bindingPropertyName] }
                    </li>
                );
            }
            else
            {
                return(
                    <li className="predlog-kontejner">
                        { predlog }
                    </li>
                );
            }
        });
    }

    function klikNaPredlog(event: React.MouseEvent<HTMLUListElement>)
    {
        const { target } = event;
        const theTarget = target as HTMLElement;

        if(theTarget.classList.contains("predlog-kontejner"))
        {
            const parentContainer = theTarget.closest(".kontejner-unosa-sa-predlozima");
            if(props.bindingPropertyName === "korisnickoIme" || props.bindingPropertyName === "imePrimaoca")
            {
                const poljeZaUnos = parentContainer?.querySelector(".kontrola") as HTMLInputElement;
                if(theTarget.textContent)
                {
                    /*=== ovo je kad saljem poruku ===*/
                    poljeZaUnos.value = theTarget.textContent;
                    props.setPropertyName((previousState: any) => {
                        return {
                            ...previousState,
                            imePrimaoca: theTarget.textContent
                        }
                    });
                    /*=== ovo u sebi ima integrisano da brise elemente, ja zvao eksplicitno, pa brisao ddvaput
                    i bacao ggresku ===*/
                    setPredlozi([]);
                    // ocistiPojmovePretrage();
                }
            }

            /*=== ako pretrazujem naslov objave ===*/
            if(props.bindingPropertyName === "naslov")
            {
                const idObjave = theTarget.dataset.id;
                console.log(idObjave);
                // history.push(`/objava/${idObjave}`);
            }
        }
    }

    /*======>>> neamortizovano maksimalno*/
    function hendlujPretragu(event: React.ChangeEvent<HTMLInputElement>): void
    {
        const { value: unesenPojam } = event.target;

        if(unesenPojam.length >= 2)
        {
            const pojamZaBazu = odrediNazivPropertija();
            if(pojamZaBazu !== "")
            {
                let objekatZaPretragu = {
                    [pojamZaBazu]: unesenPojam
                };

                uputiPoziv(props.urlPutanja, upakujZahtev("POST", objekatZaPretragu))
                .then((korisnickaImena) => {
                    setPredlozi(korisnickaImena);
                })
                .catch((greska) => {
                    console.log(greska);
                });
            }
        }
    }

    function odrediNazivPropertija(): string
    {
        if(props.urlPutanja === PRETRAZI_KORISNICKO_IME)
            return "korisnickoIme";
        if(props.urlPutanja === PRETRAZI_NASLOV_OBJAVE)
            return "naslov";

        return "";
    }

    // function ocistiPojmovePretrage(): void
    // {
    //     if(listaPredloga.current)
    //     {
    //         if(listaPredloga.current.childNodes.length > 0)
    //         {
    //             while(listaPredloga.current.firstElementChild)
    //                 listaPredloga.current.firstElementChild?.remove();
    //         }
    //     }
    // }
}