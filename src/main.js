const fs = require("fs"),
      mustache = require("mustache"),
      _ = require("underscore"),
      co = require("co"),
      MongoClient = require("mongodb").MongoClient,
      bcrypt = require("bcrypt"),
      rstring = require("randomstring"),

      express = require("express"),
      expressSession = require("express-session"),
      MongoDBStore = require('connect-mongodb-session')(expressSession),
      mustacheExpress = require("mustache-express"),
      bodyParser = require('body-parser')

const app = express()

const config = JSON.parse(fs.readFileSync('config.json', 'utf8')),
      shedule_file = process.cwd() + "/json/shedule.json"

app.use("/js", express.static("js"))
app.use("/css", express.static("css"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressSession({
    "store": new MongoDBStore({
        "uri": `mongodb://${config.login}:${config.pass}@localhost/radio`,
        "collection": "sessions"
    }),
    "secret": config.sessionSecret,
    "resave": false,
    "saveUninitialized": false
}))
app.engine("html", mustacheExpress())
app.set("view engine", "html")
app.set("views", "html");

app.get("/logout", (req,res) => {
    delete req.session.name
    res.redirect("/")
})

app.get("/login", (req,res) => {
    if (typeof req.session.name != 'undefined') {
        res.redirect("/")
    } else {
        res.render("login")
    }
})

app.post("/login", (req,res) => {
    let {name,pass} = req.body
    co(function*() {
        let db = yield MongoClient.connect(`mongodb://${config.login}:${config.pass}@localhost/radio`)

        let assumedUser = yield db.collection("rjs").findOne({"name": {"$regex": new RegExp(`^${name}$`, "i")}})

        if (assumedUser == null) {
            res.send("Несуществующий пользователь")
        } else {
            bcrypt.compare(pass, assumedUser.pass).then(isIt => {
                if (isIt) {
                    req.session.name = assumedUser.name;
                    res.redirect("/")
                } else {
                    res.send("Неверный пароль")
                }
            }).catch(err => console.log(err.stack))
        }
    })
})

app.get("/register", (req,res) => {
    if (typeof req.session.name != 'undefined') {
        res.redirect("/")
    } else {
        res.render("register")
    }
})

app.post("/register", (req,res) => {
    let {name, pass, invite} = req.body
    bcrypt.hash(pass, 10).then(hash => {
        co(function*() {
            let db = yield MongoClient.connect(`mongodb://${config.login}:${config.pass}@localhost/radio`)

            let obj = yield db.collection("rjs").findOne({invite})

            if (obj == null)
                res.send("Несуществующий инвайт")
            else if (obj.name != null) {
                res.send("Инвайт уже использован")
            } else {
                if ((yield db.collection("rjs").count({name})) == 0 ) {
                    yield db.collection("rjs").findOneAndUpdate({invite}, {"$set": {name, pass: hash}})
                    req.session.name = name;
                    res.redirect("/")
                } else {
                    return new Error(`Имя ${name} занято`)
                }
            }
        })
    }).catch(err => console.log(err.stack))
})

app.get("/", (req,res) => {
    co(function*() {
        var db = yield MongoClient.connect(`mongodb://${config.login}:${config.pass}@localhost/radio`)

        if ((yield db.collection("days").count()) == 0) {
            db.collection("days").insertMany([
                {"name": "Понидельник", "color": "#2AD33F", barsColor: [42, 211, 63], bars: []},
                {"name": "Вторник", "color": "#EDF11A", barsColor: [237, 241, 26], bars: []},
                {"name": "Среда", "color": "#D3412A", barsColor: [211, 65, 42], bars: []},
                {"name": "Четверг", color: "#2D69E2", barsColor: [45, 105, 22], bars: []},
                {"name": "Пятница", color: "#D32AD1", barsColor: [211, 42, 209], bars: []},
                {"name": "Суббота", color: "#FB8F17", barsColor: [251, 143, 23], bars: []},
                {"name": "Воскресенье", color: "#ABDDAF", barsColor: [171, 221, 175], bars: []}
            ])
        }

        let hours = _.range(0, 24);

        let days = _.map(
            yield db.collection("days").find().toArray(),
            day => {
                let barNums = day.bars;
                day.bars = _.map(Array(72), (_el, i) => {
                    for (num of barNums) {
                        if (num == i)
                            return day.barsColor.join()
                    }
                })
                return day;
            }
        )

        res.render("index", {"hours": hours, "days": days})

        db.close()
    }).catch(err => console.log(err.stack))
})

if (process.argv.length > 2) {
    if (process.argv[2] == "invite") {
        co(function*() {
            let db = yield MongoClient.connect(`mongodb://${config.login}:${config.pass}@localhost/radio`)
            let invite = rstring.generate(50)

            yield db.collection("rjs").insertOne({invite})
            console.log(invite)
            process.exit()
        })
    }
} else {
    app.listen(config.port)
}
