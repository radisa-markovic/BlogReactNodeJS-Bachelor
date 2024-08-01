import path from "path";

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import Post from './models/post';
import User from './models/user';
import Comment from "./models/comment";
import Reaction from "./models/reaction";
import Tag from "./models/tag";

import postRoutes from './routes/post';
import userRoutes from './routes/user';

import sequelize from "./util/database";

import putanje from './putanje';
import { uspostaviKonekciju } from './servisneStvari';
import { azuirajNaslovnuSlikuUBazi } from './korisnik/korisnik.servis';
import { vratiKorisnickeSlike } from './korisnik/korisnik.kontroler';
import { potvrdiMejlZaPretplatu, ukloniPretplatu } from './mejlovi/mejl.kontroler';

require('dotenv').config();
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (request: any, file: any, callback: any) => {
        callback(null, './src/images/');
    },
    filename: (request: any, file: any, callback: any) => {
        callback(null, new Date().toISOString().replace(/:/g, '-') + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage})

const app = express();

app.use(express.json());
app.use(cors());
// app.use('/images', express.static(path.join(__dirname, '/images')));
app.use((request, response, next) => {
    User.findByPk(1)
        .then((user) => {
            //@ts-ignore
            request.user = user;
            next();
        })
        .catch((error) => {
            console.error(error);
        })
});

app.use((
    error: any, 
    request: Request, 
    response: Response, 
    next: NextFunction
) => {
    const data = error.data;
    const status = error.statusCode || 500;
    const message = error.message || "Something went wrong";
    response.status(status).json({
        message: message,
        data: data
    });
})

app.use("/posts", postRoutes);
app.use("/users", userRoutes);

app.use("**", (request, response, next) => {
    response.status(404).json({
        message: "No such route exists"
    })
});

User.hasMany(Post);
Post.belongsTo(User, { 
    constraints: true, 
    onDelete: 'CASCADE'
});
Post.hasMany(Comment);
Comment.belongsTo(Post, {
    constraints: true,
    onDelete: "CASCADE"
});
User.hasMany(Comment);
Comment.belongsTo(User, {
    constraints: true,
    onDelete: "CASCADE"
});
Post.hasMany(Reaction);
Reaction.belongsTo(Post, {
    constraints: true,
    onDelete: "CASCADE"
});
User.hasMany(Reaction);
Reaction.belongsTo(User);
// Post.hasMany(Tag);
// Tag.hasMany(Post);

sequelize.sync()
// sequelize.sync({force: true})
    .then(() => {
        return User.findByPk(1);
    })
    .then((user) => {
        if(!user)
        {
            User.create({
                username: "PeraPeric",
                email: "pera@pera.com",
                password: "123456789"
            });
        }
        return user;
    })
    // .then((user) => {
    //     //@ts-ignore
    //     return User
    // })
    .then(() => {
        app.listen(process.env.PORT || 3002, () => {
            console.log("Server is up and running");
        });
    })
    .catch((error: any) => {
        console.error(error);
    });


// let OSNOVNI_URL_APLIKACIJE = "https://diplomskiblog.nutri4run.com";
// let OSNOVNI_URL_APLIKACIJE = "http://localhost:3002";

// app.get("/korisnickeSlike/:korisnickoIme", vratiKorisnickeSlike);

// app.post("/korisnickeSlike", upload.single("image"), (request: any, response) => {
//     const { idKorisnika, tipKorisnickeSlike } = request.body;
//     /* da sklonim src*/
//     const CDNSlike: string = OSNOVNI_URL_APLIKACIJE + request.file.path.substring(3).replace(/\\/g, "/"); 
//     let upit: string = "";

//     if(tipKorisnickeSlike === "naslovna")
//     {
//         upit += `INSERT INTO naslovne_slike(idKorisnika, urlNaslovneSlike)
//         VALUES (${parseInt(idKorisnika)}, "${CDNSlike}")`;
//     }

//     if(tipKorisnickeSlike === "profilna")
//     {
//         upit += `INSERT INTO profilne_slike(idKorisnika, urlProfilneSlike)
//         VALUES (${parseInt(idKorisnika)}, "${CDNSlike}")`;
//     }

//     console.trace(upit);
//     const konekcijaKaBazi = uspostaviKonekciju();
//     konekcijaKaBazi.query(upit, (greska, rezultat) => {
//         if(greska)
//         {
//             console.error(greska);
//             response.sendStatus(400);
//         }
//         else
//         {
//             console.dir(rezultat);
//             if(tipKorisnickeSlike === "naslovna")
//             {
//                 response.status(200).json({urlNaslovneSlike: CDNSlike});
//                 return;
//             }

//             if(tipKorisnickeSlike === "profilna")
//             {
//                 response.status(200).json({urlProfilneSlike: CDNSlike});
//                 return;
//             }
//         }
//     });
// });

// app.patch("/korisnickeSlike", upload.single("image"), (request: any, response) => {
//     const { idKorisnika, tipKorisnickeSlike } = request.body;
//     const CDNSlike = OSNOVNI_URL_APLIKACIJE + request.file.path.substring(3).replace(/\\/g, "/"); /* da sklonim src*/

//     let upit: string = "";
//     if(tipKorisnickeSlike === "naslovna")
//     {
//         upit += `
//             UPDATE naslovne_slike
//             SET urlNaslovneSlike = "${CDNSlike}"
//             WHERE idKorisnika = ${idKorisnika};
//         `;

//         // UPDATE profilne_slike
//         // SET urlProfilneSlike = "http://localhost:3002/images/2022-10-01T21-48-40.083Z.png"
//         // WHERE idKorisnika = 43;
//     }

//     if(tipKorisnickeSlike === "profilna")
//     {
//         upit += `
//             UPDATE profilne_slike
//             SET urlProfilneSlike = "${CDNSlike}"
//             WHERE idKorisnika = ${idKorisnika};
//         `;
//     }

//     console.trace(upit);

//     const konekcijaKaBazi = uspostaviKonekciju();
//     konekcijaKaBazi.query(upit, (greska, rezultat) => {
//         if(greska)
//         {
//             console.error(greska);
//             response.sendStatus(400);
//             return;
//         }
//         else
//         {
//             response.sendStatus(200);
//         }
//     });
// });

// app.post("/postaviNaslovnu", upload.single("image"), (request: any, response) => {
//     const { idKorisnika, tipKorisnickeSlike } = request.body;

//     const CDNSlike = "http://localhost:3002" + request.file.path.substring(3).replace(/\\/g, "/"); /* da sklonim src*/
//     const konekcijaKaBazi = uspostaviKonekciju();
//     const upit: string = `
//         INSERT INTO slike_na_korisnickoj_stranici(idKorisnika, urlNaslovneSlike)
//         VALUES (${parseInt(idKorisnika)}, "${CDNSlike}")    
//     `;

//     konekcijaKaBazi.query(upit, (greska, rezultat) => {
//         if(greska)
//         {
//             console.error(greska);
//             response.sendStatus(400);
//         }
//         else
//         {
//             console.dir(rezultat);
//             response.status(200).json({urlNaslovneSlike: CDNSlike});
//         }
//     });
// });

/*===== multer mora da se pozove izmedju kao middleware bez obzira na tip HTTP zahteva =====*/
// app.patch("/postaviNaslovnu", upload.single("image"), (request: any, response) => {
//     const { idKorisnika, tipKorisnickeSlike } = request.body;
//     const CDNSlike = "http://localhost:3002" + request.file.path.substring(3).replace(/\\/g, "/"); /* da sklonim src*/

//     const ishodAzuriranja = azuirajNaslovnuSlikuUBazi(idKorisnika, CDNSlike);
//     ishodAzuriranja.then((podaci) => {
//         console.log(podaci);
//         response.sendStatus(200);
//     }).catch((greska) => {
//         console.error(greska);
//         response.sendStatus(400);
//     });
// });

/*======= profilna slika ========*/
// app.post("/postaviProfilnu", upload.single("image"), (request: any, response) => {
//     const { idKorisnika, tipKorisnickeSlike } = request.body;

//     const CDNSlike = "http://localhost:3002" + request.file.path.substring(3).replace(/\\/g, "/"); /* da sklonim src*/
//     const konekcijaKaBazi = uspostaviKonekciju();

//     /*sad, insert into ce da mozda duplira unos, mozda patch ako vec postoji ulaz u bazi*/
//     const upit: string = `
//         INSERT INTO slike_na_korisnickoj_stranici(idKorisnika, urlNaslovneSlike)
//         VALUES (${parseInt(idKorisnika)}, "${CDNSlike}")
//     `;
// });

// app.post("/uploadImage", upload.single("image"), (request: any, response) => {
//     const { idClanka } = request.body;
//     const CDNSlike = OSNOVNI_URL_APLIKACIJE + request.file.path.substring(3).replace(/\\/g, "/"); /* da sklonim src*/

//     const konekcijaKaBazi = uspostaviKonekciju();

//     const upit = `INSERT INTO skladisteZaSlike(urlSlike) 
//                     VALUES("${CDNSlike}");`

//     konekcijaKaBazi.query(upit, (greska, rezultat) => {
//         if(greska)
//         {
//             response.status(400).send({neValja: true});
//         }
//         else
//         {
//             if(idClanka)
//             {
//                 const upitZaNaslovnuSliku = `
//                     UPDATE objave 
//                     SET URLNaslovneSlike = "${CDNSlike}"
//                     WHERE id = ${parseInt(idClanka)};`;
                                    
//                 konekcijaKaBazi.query(upitZaNaslovnuSliku, (greska, rezultat) => {
//                     if(greska)
//                     {
//                         response.status(400).send({neValjaNaslovna: true});
//                     }
//                     else
//                     {
//                         response.status(200).send({urlSlike: CDNSlike});
//                     }
//                 });
//             }
//             else
//             {
//                 response.status(200).send({urlSlike: CDNSlike});
//             }
//         }
//     });

    // console.log(request.body.slikaJeNaslovna === "da");

    // konekcijaKaBazi.query(upit, (greska, rezultat) => {
    //     if(!greska)
    //     {
    //         if(request.body.slikaJeNaslovna === "da")
    //         {
    //             const upit = `UPDATE objave SET URLNaslovneSlike="${CDNSlike}" WHERE id=${parseInt(idClanka)};`
    //             konekcijaKaBazi.query(upit, (greska, rezultat) => {
    //                 if(!greska)
    //                 {
    //                     response.status(200).send({
    //                         uspesanUpload: true,
    //                         putanjaDoFajla: CDNSlike
    //                     });
    //                 }
    //                 else
    //                 {
    //                     response.status(400).send({
    //                         neValja: true
    //                     });
    //                 }
    //             });
    //         }
    //         else
    //         {
    //             response.status(200).send({
    //                 uspesanUpload: true,
    //                 putanjaDoFajla: CDNSlike
    //             });
    //         } 
    //     }
    //     else
    //     {
    //         response.status(400).send({
    //             neValja: true
    //         });
    //     }
    // });
// });

// app.get("/brisiKorisnika/:mejl", ukloniPretplatu);
// app.post("/potvrdiMejlZaPretplatu", potvrdiMejlZaPretplatu);

// putanje(app);