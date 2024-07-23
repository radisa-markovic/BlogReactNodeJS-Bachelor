import { TipoviPreporuka } from "../models/TipoviPreporuka";
import Preporuke from "./blog/Preporuke";
import SpisakObjava from "./blog/SpisakObjava";

function Home(): JSX.Element
{
    return (
        <section>
            <header>
                <h1 className="home__title" style={{fontFamily: 'fantasy'}}>
                    Blog
                </h1>
            </header>
            <Preporuke vrstaPreporuke={TipoviPreporuka.NAJVISE_LAJKOVA} preporukaUVrsti={3} prijavljenoKorisnickoIme={""}/>
            {/* <SpisakObjava adminJePrijavljen={false} /> */}
        </section>
    );
}

export default Home;