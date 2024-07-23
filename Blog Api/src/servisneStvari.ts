import * as mysql  from "mysql2";

//user: "nutri4run_glavnokomandujuci",
//password: "N2Oiv$J;Z2*W",
// database: "blog_diplomski",
// database: "nutri4run_blog_diplomski",

const mysqlPool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "blog_diplomski",
    connectionLimit: 5
});

export function uspostaviKonekciju()
{
    return mysqlPool;
}