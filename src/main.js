const fs = require("fs"),
      express = require("express"),
      mustache = require("mustache"),
      _ = require("lodash"),
      app = express(),
      mustacheExpress = require("mustache-express")

app.use("/js", express.static("js"))
app.use("/css", express.static("css"))
app.engine("html", mustacheExpress())
app.set("view engine", "html")
app.set("views", "html");

app.get("/", (req,res) => {
    let mData = {
        "hours": _.range(0, 24),
        "days": [
            {"name": "Понидельник", "color": "#2AD33F", "bars": Array(72).fill("42, 211, 63")},
            {"name": "Вторник", "color": "#EDF11A", bars: Array(72).fill("237, 241, 26")},
            {"name": "Среда", "color": "#D3412A", bars: Array(72).fill("211, 65, 42")},
            {"name": "Четверг", "color": "#2D69E2", bars: Array(72).fill("45, 105, 226")},
            {"name": "Пятница", "color": "#D32AD1", bars: Array(72).fill("211, 42, 209")},
            {"name": "Суббота", "color": "#FB8F17", bars: Array(72).fill("251, 143, 23")},
            {"name": "Воскресение", color: "#ABDDAF", bars: Array(72).fill("171,221,175")}
        ]
    }

    res.render("index", mData)
})

app.listen(3000, () => {

})
