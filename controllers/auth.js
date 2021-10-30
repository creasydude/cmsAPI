import JWT from 'jsonwebtoken';
import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import SucResponse from "../utils/SucResponse.js";
import setRtCookie from "../utils/setRtCookie.js";

export const registerController = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        await User.create({
            email,
            password
        })
        SucResponse(res, 201, { message: "User Created." });
    } catch (err) {
        next(new ErrorResponse(err, 400));
    }

};

export const loginController = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return next(new ErrorResponse("Email Doesnt Exist , Try Register.", 400));
        if (!await user.isPasswordCorrect(password)) return next(new ErrorResponse("Incorrect Password.", 400));
        const { accessToken, refreshToken } = user.generateTokens();
        setRtCookie(res, refreshToken);
        await User.findOneAndUpdate({ email }, { rtKey: refreshToken });
        SucResponse(res, 200, { accessToken });

    } catch (err) {
        next(err)
    }
};

export const refreshTokenController = async (req, res, next) => {
    const { RT } = req.signedCookies;
    if (!RT) return next(new ErrorResponse("No Refresh Token Found.", 400));
    try {
        const validate = JWT.verify(RT, process.env.REFRESH_TOKEN_SEC);
        const user = await User.findOne({ _id: validate._id });
        const { accessToken } = user.generateTokens();
        SucResponse(res, 200, { accessToken });
    } catch (err) {
        next(err)
    }
};

export const forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    if (!email) return next(new ErrorResponse("Enter Email.", 400));
    try {
        const user = await User.findOne({ email });
        if (!user) return next(new ErrorResponse("Email Doesnt Exist!", 404));
        const currentDate = new Date().toISOString();
        if (user.fpKey && (new Date(user.fpKeyExpire) - new Date(currentDate)) > 0) return next(new ErrorResponse("Link Already Exist.", 400));
        const forgetPasswordKey = user.forgotPassword();
        await user.save();
        // Make Send Code To Email Logic
        SucResponse(res, 201, { forgetPasswordKey });
    } catch (err) {
        next(err)
    }
};

export const resetPassword = async (req, res, next) => {
    const { forgetPasswordKey, newPassword } = req.body;
    if (!forgetPasswordKey) return next(new ErrorResponse("Enter Key.", 400));
    try {
        const user = await User.findOne({ fpKey: forgetPasswordKey });
        const currentDate = new Date().toISOString();
        if (!user || (new Date(user.fpKeyExpire) - new Date(currentDate)) < 0) return next(new ErrorResponse("Invalid Code Or Expired.", 400));
        user.resetPassword(newPassword);
        await user.save();
        SucResponse(res, 200 );
    } catch (err) {
        next(err)
    }
};

export const testRoute = (req,res,next) => {
    res.status(200).json({_id : req.userId})
};