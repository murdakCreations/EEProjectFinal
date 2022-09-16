const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const crypto = require('crypto')
const mongoose = require('mongoose')
const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const methodOverride = require('method-override')
const { resolve } = require('path')
const { rejects } = require('assert')
const { MongoClient,ObjectID } = require('mongodb');

const app = express()

// Middleware
app.use(bodyParser.urlencoded({ extended: true },{limit: '4mb'}));
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

async function main() {

    // Mongo URI
    const mongoURI = "mongodb+srv://murdak:m0ng0DB4tl45@cluster0.eg7va.mongodb.net/?retryWrites=true&w=majority"
    const client = new MongoClient(mongoURI);
    const collection = client.db("deviceDB").collection("devCollection");

    try {
        await client.connect();
        // Create mongo connection
        const conn = mongoose.createConnection(mongoURI)


        let gfs, gridfsBucket;
        conn.once('open', () => {
            gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
                bucketName: 'myCustomBucket'
            });

            gfs = Grid(conn.db, mongoose.mongo);
            gfs.collection('myCustomBucket');
        })

        // Create storage engine
        const storage = new GridFsStorage({
            url: mongoURI,
            file: (req, file) => {
                return new Promise((resolve, reject) => {
                    crypto.randomBytes(16, (err, buf) => {
                        if (err) {
                            return reject(err)
                        }
                        const filename = buf.toString('hex') + path.extname(file.originalname)
                        const fileInfo = {
                            filename: filename,
                            bucketName: 'myCustomBucket'
                        }
                        resolve(fileInfo)
                    })
                })
            }
        })
        const upload = multer({ storage }) 

        app.get('/displayImg', (req, res) => {
            //res.render('index')
            gfs.files.find().toArray((err, files) => {
                if (!files || files.length === 0) {
                    res.render('displayImg', {files: false})
                }
                else {
                    files.map(file => {
                        if (file.contentType === 'image/jpeg' || 
                        file.contentType === 'image/png')
                        {
                            file.isImage = true
                        }
                        else
                        {
                            file.isImage = false
                        }
                    })
                    res.render('displayImg', {files: files})
                }
            })
        })

        app.post('/upload', upload.single('file'), (req, res) => {
            //res.json({ file: req.file })
            //res.redirect('/goToAnotherDevices')
            /*res.redirect(307, '/goToDevices', {
                floorBuild: 'College of Engineering'
            })*/

            collection.findOneAndUpdate(
                { roomID: req.body.roomID },
                {
                    $set: {
                        img: req.file.filename
                    }
                },
                {
                    upsert: true
                }
            )
                .then(result => {
                    //console.log(result)
                    const cursor = collection.find({
                        buildName: req.body.floorBuild,
                        roomID: req.body.roomID,
                        devId: { $exists: true }
                    }).toArray()
                        .then(results => {
                            res.render('addDeviceSecond', 
                            {
                                file: req.file.filename,
                                deviceData: results,
                                bName: req.body.floorBuild,
                                roomName: req.body.roomName,
                                roomID: req.body.roomID,
                                floorID: req.body.floorID
                            })
                        })
                        .catch(error => console.error(error))
                })
                .catch(error => console.error(error))
        })

        app.get('/files', (req, res) => {
            gfs.files.find().toArray((err, files) => {
                if (!files || files.length === 0) {
                    return res.status(404).json({
                        err: 'No files exist'
                    })
                }
                return res.json(files)
            })
        })

        app.get('/files/:filename', (req, res) => {
            gfs.files.findOne({filename: req.params.filename}, (err, file) => {
                if (!file || file.length === 0) {
                    return res.status(404).json({
                        err: 'No file exists'
                    })
                }
                return res.json(file)
            })
        })

        app.get('/image/:filename', (req, res) => {
            gfs.files.findOne({filename: req.params.filename}, (err, file) => {
                if (!file || file.length === 0) {
                    return res.status(404).json({
                        err: 'No file exists'
                    })
                }
                if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                    /*const readStream = gfs.createReadStream(file.filename)
                    readStream.pipe(res)*/
                    const readStream = gridfsBucket.openDownloadStreamByName(file.filename);
                    readStream.pipe(res);
                }
                else {
                    res.status(404).json({
                        err: 'Not an image'
                    })
                }
            })
        })

        app.post('/files/:id', (req, res) => {
            gridfsBucket.delete(ObjectID(req.params.id), (err, gridStore) => {
                if(err) {
                    return res.status(404).json({ err: err })
                }
            })
            res.redirect('/displayImg')
        })

        // Make the appropriate DB calls
        app.get('/', (req, res) =>{
            res.render('index.ejs')
        })

        app.get('/login', (req, res) => {
            res.render('login.ejs')
        })

        app.get('/room', (req, res) => {
            
            const cursor = collection.find().toArray()
                .then(results => {
                    res.render('buildRooms.ejs', {rooms: results})
                })
                .catch(error => console.error(error))
        })

        app.get('/device', (req, res) => {
            const cursor = collection.find().toArray()
                .then(results => {
                    res.render('addDevice.ejs', {deviceData: results})
                })
                .catch(error => console.error(error))
        })

        // go to floor page and display floors in the building
        app.post('/goTofloor', (req, res) => {
            //console.log(req.body.floorBuild)
            const cursor = collection.find({
                buildName: req.body.floorBuild
            }).toArray()
                .then(results => {
                    //console.log(results)
                    //res.json('Success')
                    res.render('buildFloors.ejs', 
                    {
                        floors: results,
                        bName: req.body.floorBuild
                    })
                })
                .catch(error => console.error(error))
        })

        // go to floor page and display floors in the building
        app.post('/goToRooms', (req, res) => {
            //console.log(req.body.floorBuild)
            const cursor = collection.find({
                buildName: req.body.floorBuild,
                floorID: req.body.floorID,
                roomID: { $exists: true }
            }).toArray()
                .then(results => {
                    //console.log(results)
                    res.render('buildRooms.ejs', 
                    {
                        rooms: results,
                        bName: req.body.floorBuild,
                        floorName: req.body.floorName,
                        floorID: req.body.floorID
                    })
                })
                .catch(error => console.error(error))
        })

        // go to floor page and display floors in the building
        app.post('/goToDevices', (req, res) => {
            //console.log(req.body)
            //console.log(req.body.floorBuild)
            const cursor = collection.find({
                buildName: req.body.floorBuild,
                roomID: req.body.roomID,
                devId: { $exists: true }
            }).toArray()
                .then(results => {
                    //console.log(results)
                    res.render('addDevice.ejs', 
                    {
                        deviceData: results,
                        bName: req.body.floorBuild,
                        roomName: req.body.roomName,
                        roomID: req.body.roomID,
                        floorID: req.body.floorID
                    })
                })
                .catch(error => console.error(error))
        })

        app.post('/goToAnotherDevices', (req, res) => {
            //console.log(req.body)
            //console.log(req.body.floorBuild)
            const cursor = collection.find({
                buildName: req.body.floorBuild,
                roomID: req.body.roomID,
                devId: { $exists: true }
            }).toArray()
                .then(results => {
                    res.render('addDeviceSecond', 
                    {
                        file: req.body.img,
                        deviceData: results,
                        bName: req.body.floorBuild,
                        roomName: req.body.roomName,
                        roomID: req.body.roomID,
                        floorID: req.body.floorID
                    })
                })
                .catch(error => console.error(error))
        })

        app.post('/buildIn', (req, res) =>{
            collection.findOne({
                buildId: req.body.loginID   
            })
                .then(result => {
                    if(result !== null) {
                        const cursor = collection.find({
                            buildName: result.buildName
                        }).toArray()
                            .then(results => {
                                res.render('dashboard.ejs', 
                                {
                                    floors: results,
                                    bName: result.buildName
                                })
                            })
                            .catch(error => console.error(error))
                        
                    } else {
                        return res.json('ID not found')
                    }
                })
                .catch(error => console.error(error))
        })

        app.post('/img', (req, res) => {
            collection.insertOne(req.body)
                .then(result => {
                    console.log(result)
                    res.json('Success')
                })
                .catch(error => console.error(error))
        })

        app.post('/device', (req, res) =>{
            // if image is uploaded, save image data and not just filename
            collection.insertOne(req.body)
                .then(result => {
                    //console.log(result)
                    res.json('Success')
                })
                .catch(error => console.error(error))
        })

        app.post('/floor', (req, res) =>{
            // if image is uploaded, save image data and not just filename
            collection.insertOne(req.body)
                .then(result => {
                    //console.log(result)
                    res.json('Success')
                })
                .catch(error => console.error(error))
            //console.log('post floor')
        })

        app.post('/room', (req, res) =>{
            // if image is uploaded, save image data and not just filename
            collection.insertOne(req.body)
                .then(result => {
                    res.json('Success')
                })
                .catch(error => console.error(error))
            //console.log('post floor')
        })

        app.put('/device', (req, res) => {
            collection.findOneAndUpdate(
                { 
                    devId: req.body.devId,
                    roomID: req.body.roomID,
                    floorID: req.body.floorID,
                    buildName: req.body.buildName // update value with in database with name '' 
                },
                {
                    $set: {
                        devLoc: req.body.devLoc, 
                        devTyp: req.body.devTyp, 
                        life: req.body.life, 
                        dateInstall: req.body.dateInstall, 
                        timeInstall: req.body.timeInstall, 
                        stat: req.body.stat, 
                        inspStat: req.body.inspStat
                    }
                },
                {
                    upsert: true
                }
            )
                .then(result => {
                    res.json('Success')
                })
                .catch(error => console.error(error))
        })

        app.put('/floor', (req, res) => {
            console.log(req.body)
            collection.findOneAndUpdate(
                { floorID: req.body.floorID },
                {
                    $set: {
                        floorName: req.body.floorName
                    }
                },
                {
                    upsert: true
                }
            )
                .then(result => {
                    console.log(result)
                    res.json('Success')
                })
                .catch(error => console.error(error))
        })

        app.put('/room', (req, res) => {
            console.log(req.body)
            collection.findOneAndUpdate(
                { roomID: req.body.roomID },
                {
                    $set: {
                        roomName: req.body.roomName
                    }
                },
                {
                    upsert: true
                }
            )
                .then(result => {
                    console.log(result)
                    res.json('Success')
                })
                .catch(error => console.error(error))
        })

        app.delete('/device',(req,res) => {
            // Handle delete event here
            collection.deleteOne(
                { devId: req.body.devId }
            )
                .then(result => {
                    if (result.deletedCount === 0){
                        return res.json('No quote to delete')
                    }
                    res.json('Deleted Darth Vadar qute')
                })
                .catch(error => console.error(error))
        })

        app.delete('/floor',(req,res) => {
            collection.deleteMany(
                {floorID: req.body.floorID}
            )
                .then(results => {
                    res.json('Deleted Floor Name')
                })
                .catch(error => console.error(error))
        })

        app.delete('/room',(req,res) => {
            collection.deleteMany(
                {roomID: req.body.roomID}
            )
                .then(result => {
                    res.json('Deleted Room Name')
                })
                .catch(error => console.error(error))
        })

        const pipeline = [];

        
        await monitorListingsUsingEventEmitter(client, 30000, pipeline);


        app.listen(process.env.PORT || 5000, function() {
            console.log('listening on 5000')
        })
    } finally {

    }
}
main().catch(console.error)

function closeChangeStream(timeInMs = 1000, changeStream) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Closing the change stream");
            changeStream.close();
            resolve();
        }, timeInMs)
    })
};

async function monitorListingsUsingEventEmitter(client, timeInMs = 30000, pipeline = []) {
    const collection = client.db("deviceDB").collection("deviceCollection");

    const changeStream = collection.watch(pipeline);

    changeStream.on('change', (next) => {
        
        console.log(next);
        collection.findOne({
            _id: next.documentKey._id
        })
            .then(result => {
                if(result !== null) {
                    changedVal = result
                    console.log(result)
                } else {
                    console.log('ID not found')
                }
            })
            .catch(error => console.error(error))
        
    });

}