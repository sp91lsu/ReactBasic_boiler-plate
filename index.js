const express = require('express')
const app = express()
const port = 4500

const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
const config = require('./config/key')
mongoose.connect(config.mongoURI,{
    useNewUrlParser:true, useUnifiedTopology:true
}).then(()=> console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

const {User} = require("./models/User");

const bodyParser = require('body-parser')
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))
//application/json
app.use(bodyParser.json())


//Routing -----------------------
app.get('/', (req, res) => res.send('Hello World!~~새해복 많이받으세요'))

app.post('/register', (req, res) => {

    //회원가입 할 때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({success : false, err})
        return res.status(200).json({
            success : true
        })
    })

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
