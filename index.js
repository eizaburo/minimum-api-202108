const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./test.db", (error) => {
    if (error) {
        console.error("Database error:" + error.message);
    } else {
        db.serialize(() => {
            db.run("drop table if exists inquiries");
            db.run("create table if not exists inquiries( \
                        id integer primary key autoincrement, \
                        email nverchar(64), \
                        body text,　\
                        created_at text not null default (datetime('now','localtime'))\
                )", (error) => {
                if (error) {
                    console.error("Table error:" + error.message);
                }
            });
        });
    }
});

//CORS
app.use((req, res, next) => {
    // res.header("Content-Security-Policy", "default-src 'self'");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    // res.header("X-Frame-Options", "SAMEORIGIN");
    next();
});

//
app.get("/", (req, res) => {
    res.send("Welcome");
});

//
app.post("/inquiry", (req, res) => {

    console.log(JSON.stringify(req.body));

    const email = req.body.email;
    const body = req.body.body;

    const stmt = db.prepare("insert into inquiries(email,body) values(?,?)");
    stmt.run(email, body, (error, result) => {
        if (error) {
            res.send("エラーです");
            // res.status(400).json({
            //     "status": "error",
            //     "message": error.message
            // });
        } else {
            // res.status(200).json({
            //     "status": "OK",
            //     "lastID": stmt.lastID
            // });
            res.send("受取りました");
        }
    });
});

//Listen
app.listen(3001, () => {
    console.log("Start server on port 3001.");
})