import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

const userSchema = mongoose.Schema({
    email : {
        type: String,
        required: true,
        match : /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    password : {
        type: String,
        required: true,
        match: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    },
    rtKey : {
        type: String,
        required: false
    },
    fpKey : {
        type : String,
        required: false
    },
    fpKeyExpire : {
        type : Date,
        required: false
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    const pwCompare = await bcrypt.compare(password, this.password);
    return pwCompare;
}

userSchema.methods.generateTokens = function () {
    return {
        accessToken : JWT.sign({_id : this._id} , process.env.ACCESS_TOKEN_SEC, {expiresIn : '15m'}),
        refreshToken : JWT.sign({_id : this._id}, process.env.REFRESH_TOKEN_SEC , {expiresIn : '360d'})
    }
}

userSchema.methods.forgotPassword = function () {
    const date = new Date().setDate(new Date().getDate() + 1);
    const randomNums = Math.floor(100000000000 + Math.random() * 900000000000);
    this.fpKey = randomNums;
    this.fpKeyExpire = date;
    return randomNums;
}

userSchema.methods.resetPassword = function(password) {
    this.password = password;
    this.fpKey = null;
    this.fpKeyExpire = null;
}

const User = mongoose.model("User", userSchema);

export default User;