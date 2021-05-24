const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 6050;

const bodyParser = require('body-parser')
const User = require('./models/User')
const { Post } = require('./models/Post')

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const mySql = require('./src/dbConfig')

try {
    const data = mySql.query(`SELECT * FROM test`)
    console.log('MySql connected...');
} catch (err) {
    throw err
}

// mySql.getConnection( function( err, connection ) 
// {  
//     if ( err ) 
//         throw err;
//     else 
//     {
//         // var sql = `INSERT INTO test(test)VALUES(?)`
//         // var param = [
//         //     'abc'
//         // ]
//         var sql = `SELECT * FROM test`
//         //var sql = `UPDATE test SET test = 'a' WHERE id = 1`
//         connection.query(sql, (err, results) => {
//             if (err) 
//                 throw err;
//             else 
//                 console.log('MySql connected...');
//         });
//         // 커넥션 반환 ( 커넥션 종료 메소드가 커넥션과 다르다 )
//         connection.release() 
//     }
// });

app.post('/api/register', async (req, res) => {
    const response = {
        success: false,
        error: '',
    }
    const user = {...req.body}

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

    try {
        const [result] = await mySql.query(`SELECT * FROM USER WHERE userId = ?`, user.userId)
        if(result == "") data.idCheck = true
    } catch (err) {
        response.error = err
    }

    if(data.check) {
        var sql = `INSERT INTO user(name, email, userId, password, passwordCheck)VALUES(?, ?, ?, ?, ?)`;
        var param = [
            user.name, user.email, user.userId, user.password, user.passwordCheck
        ]
        try {
            response.success = true
            const [result] = await mySql.query(sql, param)
        } catch (err) {
            response.success = false
            response.error = err
        }
    }

    return res.status(200).json({
        ...response, ...data
    })
})

app.post('/api/login', async (req, res) => {
    const response = {
        success: false,
        error: '',
    }
    const user = {...req.body}

    var data = {
        idCheck: false,
        pwCheck: false,
    }

    try {
        const [result] = await mySql.query(`SELECT * FROM USER WHERE userId = ?`, user.userId)
        response.success = true
        data.idCheck = user.userId == result[0].userId
        data.pwCheck = user.password == result[0].password
    } catch (err) {
        response.success = false
        response.error = err
    }

    return res.status(200).json({
        ...response, ...data
    })
})

app.get('/api/post', async (req, res) => {
    const response = {
        success: false,
        error: '',
    }
    var posts;

    try {
        const [result] = await mySql.query(`SELECT * FROM post`)
        response.success = true
        posts = {...result}
    } catch (err) {
        response.success = false
        response.error = err
    }

    return res.status(200).json({ ...response, posts })
})

app.post('/api/post/add', async (req, res) => {
    const response = {
        success: false,
        error: '',
    }
    const post = {...req.body}

    var sql = `INSERT INTO post(userId, body, time)VALUES(?, ?, ?)`;
    var param = [
        post.userId, post.body, post.time
    ]
    try {
        const [result] = await mySql.query(sql, param)
        response.success = true;
    } catch (err) {
        response.success = false
        response.error = err
    }
    
    return res.status(200).json({
        ...response
    })
})

app.post('/api/post/del', async (req, res) => {
    const response = {
        success: false,
        error: '',
    }

    try {
        const [result] = await mySql.query(`DELETE FROM post WHERE id = ?`, req.body.id)
        response.success = true
    } catch (err) {
        response.success = false
        response.error = err
    }

    return res.status(200).json({ response })
})

app.get('/', (req, res) => res.send('Main'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

