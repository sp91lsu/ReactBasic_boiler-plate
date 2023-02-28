import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import {mongoURI} from "./config/key.js";
import AuthController from "./controller/AuthController.js";
import AppsController from "./controller/AppsController.js";
const app = express()
const port = 4500

import mongoose from "mongoose";
mongoose.set('strictQuery', true);
mongoose.connect(mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))
//application/json
app.use(bodyParser.json())

app.use(cookieParser());  // 토큰을 쿠키에 저장하기 위해 사용

app.use(cors({
    origin: "http://localhost:3000", // 접근 권한을 부여하는 도메인
    credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
    optionsSuccessStatus: 200, // 응답 상태 200으로 설정
}));

//Routing -----------------------
AuthController(app)
AppsController(app)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

