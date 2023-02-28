import {User} from "../models/User.js";
import {auth} from "../middleware/auth.js";
import pkg from 'lodash';
const {isEmpty} = pkg;


export default function AuthController (app) {
    app.get('/', (req, res) => res.send('Hello World!~~새해복 많이받으세요'))

    app.post('/api/sign-up', (req, res) => {
        const successFunc = () => {
            //회원가입 할 때 필요한 정보들을 client에서 가져오면
            //그것들을 데이터 베이스에 넣어준다.
            const user = new User(req.body)

            user.save((err, userInfo) => {
                if (err) return res.json({success: false, err})
                return res.status(200).json({
                    success: true
                })
            })
        }

        User.findOne({userName: req.body.userName}, (err, user) => {
            if (!isEmpty(user)) return res.status(400).json({success: false, err, message: 'User already exist!'});
            if (err) return res.json({success: false, err});

            User.findOne({email: req.body.email}, (err, user) => {
                if (!isEmpty(user)) return res.status(400).json({success: false, err, message: 'Email already used'})
                if (err) return res.json({success: false, err});

                successFunc()
            })
        })
    })

    app.post('/api/sign-in', (req, res) => {
        // 요청된 이메일을 데이터베이스에서 있는지 찾는다
        User.findOne({userName: req.body.userName}, (err, user) => {
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "제공된 id에 해당하는 유저가 없습니다."
                })
            }

            // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (!isMatch)
                    return res.status(400).json({
                        success: false, message: "비밀번호가 틀렸습니다."
                    })

                // 비밀번호까지 맞다면 토큰을 생성
                user.generateToken((err, user) => {
                    if (err) return res.status(400).send(err);

                    const userObj = {userName: user.userName, email: user.email, authority: user.authority}

                    // 정상적일 경우 토큰을 쿠키나 로컬스토리지 등에 저장
                    // 쿠키에 저장
                    res.status(200)
                        .json({success: true, user: userObj, token: user.token})
                })
            })
        })
    })

    app.get('/api/auth', auth, (req, res) => {
        // 여기까지 미들웨어(auth.js)를 통과해 왔다는 얘기는 Authentication이 True라는 말
        // 클라이언트에게 유저 정보 전달
        res.status(200).json({
            _id: req.user._id,
            userName: req.user.userName,
            email: req.user.email,
            authority: req.user.authority,
            isAuth: true,
            lastname: req.user.lastname,
            image: req.user.image
        })
    })

    app.post('/api/sign-out', (req, res) => {
        User.findOneAndUpdate({userName: req.body.userName}, {token: ""}, (err, user) => {
            if (err) return res.json({success: false, err});
            return res.status(200).send({
                success: true
            })
        })
    })
}