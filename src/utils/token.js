import jwt from 'jsonwebtoken';

export function createJwt(res, userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRETE, {
    expiresIn: '5d',
  });

  res.cookie('token',token,{
    httpOnly:true,
    secure:process.env.NODE_ENV === "production",
    sameSite:"strict",
    maxAge: 1000 * 60 * 60 *24 * 5
  });
}
