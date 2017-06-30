const fs = require("fs"),
      express = require("express"),
      mustache = require("mustache"),
      _ = require("lodash"),
      app = express(),
      mustacheExpress = require("mustache-express"),
      s = require("./schedule.js");

const port = 3000,
      shedule_file = process.cwd() + "/json/shedule.json"

var shed = fs.readFile(shedule_file, {encoding: 'utf-8'}, function(err, data){
    if (err) {
        // s.createDefaultFile()
        console.error(err)
    } else {
        s.shedule = JSON.parse(data)
    }
})

app.use("/js", express.static("js"))
app.use("/css", express.static("css"))
app.engine("html", mustacheExpress())
app.set("view engine", "html")
app.set("views", "html");

app.get("/", (req,res) => {
    let mData = {
        "hours": _.range(0, 24),
        "days": [
            {"name": s.shedule.pn.name, "color": "#2AD33F", "bars": Array(72).fill("42, 211, 63")},
            {"name": s.shedule.vt.name, "color": "#EDF11A", bars: Array(72).fill("237, 241, 26")},
            {"name": s.shedule.sr.name, "color": "#D3412A", bars: Array(72).fill("211, 65, 42")},
            {"name": s.shedule.ct.name, "color": "#2D69E2", bars: Array(72).fill("45, 105, 226")},
            {"name": s.shedule.pt.name, "color": "#D32AD1", bars: Array(72).fill("211, 42, 209")},
            {"name": s.shedule.sb.name, "color": "#FB8F17", bars: Array(72).fill("251, 143, 23")},
            {"name": s.shedule.vs.name, color: "#ABDDAF", bars: Array(72).fill("171,221,175")}
        ]
    }

    res.render("index", mData)
})

app.listen(port, () => {

})
