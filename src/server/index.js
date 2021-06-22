require('dotenv').config()
const express = require('express')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

app.get('/nasa', async (req, res) => {
    const { rover } = req.query
    try {
        let date = '2015-6-3'
        let roverData = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({roverData})
    } catch (error) {
        console.log(error)
    }
});


app.listen(port, () => console.log(`Mars Dashboard server listening on port ${port}!`))