import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

//bcrypt 사이트 참고
const jwt = jsonwebtoken
const saltRounds = 10

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        maxLength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    authority:{
        type: [String],
        default: ['user']
    },
    lastname: {
        type: String,
        maxLength: 51
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    },

})

userSchema.pre('save', function ( next ) {
    var user = this;

    if (user.isModified('password')) {
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if(err) return next(err);
                user.password = hash
                next()
            });
        });
    } else {
        next();
    }

});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    //plainPassword (Ex. 1234567)
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)

    });
};

// 로그인 - 토큰 생성
userSchema.methods.generateToken = function(cb) {
    var user = this;
    // jsonwebtoken을 이용해서 토큰 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token 을 통해 토큰 생성
    // 토큰 해석을 위해 'secretToken' 입력 -> user._id 가 나옴
    // 토큰을 가지고 누구인지 알 수 있는 것
    user.token = token

    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

// auth 인증 - 복호화 (토큰을 디코드)
userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token": token}, function(err, user) {
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

export const User = mongoose.model('User', userSchema)

