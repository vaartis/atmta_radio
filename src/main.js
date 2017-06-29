const fs = require("fs"),
      express = require("express"),
      mustache = require("mustache"),
      _ = require("lodash"),
      app = express(),
      mustacheExpress = require("mustache-express")

app.use(express.static("js"))
app.use(express.static("css"))
app.engine("html", mustacheExpress())
app.set("view engine", "html")
app.set("views", "html");

app.get("/", (req,res) => {
    let mData = {
        "hours": _.range(0, 24),
        "bars": Array(72).fill("")
    }

    res.render("index", mData)
})

app.listen(3000, () => {

})
