const express = require('express')
const cors = require('cors');
const app = express()
const port = 6050

const bodyParser = require('body-parser')
const { User } = require('./models/User')
const { Post } = require('./models/Post')

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://th-gwon:dwYujvcRramyDIGf@realmcluster.qdpm4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
.catch(error => console.log(error))

app.post('/api/register', (req, res) => {
    const user = new User(req.body)

    var data = {
        nameCheck: false,
        emailCheck: false,
        idCheck: false,
        pwCheck: false,
        get check() {
            return this.idCheck & this.emailCheck & this.idCheck & this.pwCheck
        }
    }

    data.nameCheck = user.name ? true : false
    data.emailCheck = user.email ? true : false

    if(user.password !== "" | user.passwordCheck !== "") {
        if(user.password === user.passwordCheck) {
            data.pwCheck = true
        }
    }

    User.findOne({ "userId": user.userId }, (err, id) => {
        if (err) return res.json(err)
        if (!id & user.userId != "") {
            data.idCheck = true
        } else {
            data.idCheck = false
        }

        if(data.check) {
            user.save((error, userInfo) => {
                if(error) return res.json({success: false, error})
                return res.status(200).json({
                    success: true, ...data
                })
            })
        } else {
            return res.status(200).json({
                success: false, ...data
            })
        }
    })
})

app.post('/api/login', (req, res) => {
    const user = new User(req.body)

    var data = {
        idCheck: false,
        pwCheck: false,
    }

    User.findOne({ "userId": user.userId }, (err, result) => {
        if (err) return res.json(err)
        if (result) {
            data.idCheck = user.userId == result.userId
            data.pwCheck = user.password == result.password
            return res.status(200).json({ success: true, ...data, result })
        } else {
            return res.status(200).json({ success: false })
        }
    })
})

app.get('/api/post', (req, res) => {
    Post.find({  }, (err,posts) => {
        if (err) return res.json(err)
        if (posts) {
            return res.status(200).json({ success: true, posts })
        } else {
            return res.status(200).json({ success: false })
        }
    })
})

app.post('/api/post/add', (req, res) => {
    const post = new Post(req.body)

    post.save((error, data) => {
        if(error) return res.json({success: false, error})
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/post/del', (req, res) => {
    Post.remove({ "_id": req.body._id }, (err, result) => {
        if (err) return res.json(err)
        if (result) {
            return res.status(200).json({ success: true })
        } else {
            return res.status(200).json({ success: false })
        }
    })
})

app.get('/', (req, res) => res.send('Main'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

