import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';



// fs = filesystem, path = build better paths

// https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "../data")
const app = express()
const port = 3001

// instead of Sync, use regular promise (await)
const muFiles = fs.readdirSync(dataPath)
const filesContent = fs.readFileSync(path.join(dataPath, muFiles[0]), "UTF8")


/**
 * TODO
 * use fs to read and write files
 * app.post (/shopping) to create a list (if not exist)
 * app.get(/shopping/:id) to get a list
 * app.post(/shopping/:id) to add an item and amount (merging if existing)
 * app.delete(/shopping/:id) to delete list
 * app.delete(/shopping/:id/:item) to delete item in list
 */

app.use(bodyParser.json())

app.get('/shopping', (req, res, next) => {
    fs.readdir(dataPath, (err, data) => {
        if(err){
            next(err)
        } else {
            res.json(
                data
                    .map((file) => file.replace(".json", ""))
                    .filter((file) => !file.startsWith("."))
            )
        }
    })
})

app.post('/shopping', (req, res, next) => {
    const {name} = req.body
    const pathToFile = path.join(dataPath, `${name}.json`)

    fs.readFile(pathToFile, 'utf-8', (err, data) => {
        if(err){
            fs.writeFile(pathToFile, `{}`, (error) => {
                if(error){
                    next(error)
                } else {
                    res.json({})
                }
            })
        } else {
            res.json(JSON.parse(data))
        }
    })
})

app.put('/shopping/:name', (req, res, next) => {
    const name = req.params.name
    const pathToFile = path.join(dataPath, `${name}.json`)

    fs.readFile(pathToFile, 'utf-8', (err, data) => {
        if(err){
            next(err)
        } else {
            const parsedExistingData = JSON.parse(data)
            const newDataItem = req.body.item
            const combined = parsedExistingData[newDataItem]
                ? {...parsedExistingData, [newDataItem]: parsedExistingData[newDataItem] + 1}
                : {...parsedExistingData, [newDataItem]: 1}

            fs.writeFile(pathToFile, JSON.stringify(combined), (error) => {
                if(error){
                    next(error)
                } else {
                    res.json(combined)
                }
            })
        }
    })
})

app.delete('/shopping/:name/:item', (req, res, next) => {
    const {name, item} =  req.params
    const pathToFile = path.join(dataPath, `${name}.json`)

    fs.readFile(pathToFile, 'utf-8', (err, data) => {
        if(err){
            next(err)
        } else {
            const parsedExistingData = JSON.parse(data)
            delete parsedExistingData[item]

            fs.writeFile(pathToFile, JSON.stringify(parsedExistingData), (error) => {
                if(error){
                    next(error)
                } else {
                    res.json(parsedExistingData)
                }
            })
        }
    })
})

app.get('/shopping/:name', (req, res, next) => {
    const name = req.params.name
    const pathToFile = path.join(dataPath, `${name}.json`)

    fs.readFile(pathToFile, 'utf-8', (err, data) => {
        if(err){
            next(err)
        } else {
            res.json(JSON.parse(data))
        }
    })
})

app.delete('/shopping/:name', (req, res, next) => {
    const name = req.params.name
    const pathToFile = path.join(dataPath, `${name}.json`)

    fs.unlink(pathToFile, (err) => {
        if(err){
            next(err)
        } else {
            res.json("File deleted.")
        }
    })
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
