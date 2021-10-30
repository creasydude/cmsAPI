import JWT from 'jsonwebtoken';
import ErrorResponse from '../utils/ErrorResponse.js';

const userAuthControl = (req, res, next) => {
    const token = req.get('X-ACCESS-TOKEN');
    if (!token) return next(new ErrorResponse("Access Token Not Found.", 400));
    const userId = JWT.verify(token,process.env.ACCESS_TOKEN_SEC)._id;
    req.userId = userId;
    next();
}

export default userAuthControl;