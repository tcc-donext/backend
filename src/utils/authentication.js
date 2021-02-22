import jwt from 'jsonwebtoken';

// TEMPORARIO: eventualmente persistir os refresh tokens em algum lugar
const refreshTokens = [];

export function generateAcessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(user) {
  const refresh = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '12h',
  });
  refreshTokens.push(refresh);

  return refresh;
}
