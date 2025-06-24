import jwt from 'jsonwebtoken';

export function createJwt(res, payload) {
  const token = jwt.sign( payload, process.env.JWT_SECRETE, {
    expiresIn: '5d',
  });
  console.log("Token created:", token);

  res.cookie('token',token,{
    httpOnly:true,
    secure:process.env.NODE_ENV === "production",
    sameSite:"strict",
    maxAge: 1000 * 60 * 60 *24 * 5
  });
}
