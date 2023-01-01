const express = require('express')
const app = express()
const port = 4500
const config = require('./config/key')
const {User} = require("./models/User");
const bodyParser = require('body-parser')

const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
mongoose.connect(config.mongoURI,{
    useNewUrlParser:true, useUnifiedTopology:true
}).then(()=> console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

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
app.post('/login', (req, res) => {
    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당되는 유저가 없습니다."
            })
        }
    //요청된 이메일이 데이터베이스에 있다면 비번 맞는지 확인.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
                return res.json({ loginSuccess : false, message: "비밀번호가 틀렸습니다."})

    //비번 맞으면 Token 생성.
            user.generateToken((err, user) => {

            })

        });
    })



})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
