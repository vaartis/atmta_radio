const fs = require("fs"),
      express = require("express"),
      mustache = require("mustache"),
      _ = require("underscore"),
      app = express(),
      mustacheExpress = require("mustache-express"),
      co = require("co"),
      MongoClient = require("mongodb").MongoClient

const config = JSON.parse(fs.readFileSync('config.json', 'utf8')),
      shedule_file = process.cwd() + "/json/shedule.json"

app.use("/js", express.static("js"))
app.use("/css", express.static("css"))
app.engine("html", mustacheExpress())
app.set("view engine", "html")
app.set("views", "html");

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

app.listen(config.port, () => {

})
