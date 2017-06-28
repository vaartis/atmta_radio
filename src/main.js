const fs = require("fs")
const express = require("express")
const mustache = require("mustache")
const _ = require("lodash")
const app = express()

app.get("/", (req,res) => {
    fs.readFile("index.html", (err, data) => {
        if (err) throw err
        let mData = {
            "hours": _.range(0, 24),
            "bars": Array(72).fill("")
        }
        res.send(mustache.render(data.toString(), mData))
    })
})

app.listen(3000, () => {

})
