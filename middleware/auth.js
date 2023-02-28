import {User} from "../models/User.js";

export const auth = (req, res, next) => {
   // 클라이언트 쿠키에서 토큰을 가져온다.
   let token = req.headers['authorization'];

   // Remove Bearer from string
   token = token?.replace(/^Bearer\s+/, "");

   // 토큰을 복호화한 후 유저를 찾는다.
   User.findByToken(token, (err, user) => {
      if(err) return res.json({success: false, err});
      if(!user) return res.json({isAuth: false, error: true})

      req.token = token;
      req.user = user;
      next();
   })

   // 유저가 있으면 인증 OK!
   // 유저가 없으면 인증 NO!
}

