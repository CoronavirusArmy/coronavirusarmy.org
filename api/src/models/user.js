import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";
import mongoosePaginate from "mongoose-paginate-v2";


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    phone: String,
    redditUsername: String,
    zipcode: String,
    githubUsername: String,
    time: {
        type: Number,
        default: 0
    },
    profile: {
        name: String,
        img: String,
        skills: String,
        hours: {
            type: Number,
            default: 0
        },
    },
    visible: {
        type: Boolean,
        default: true
    },
    refreshToken: String,
}, {
    timestamps: true
});

userSchema.index({ 'profile.name': 'text' });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch);
    });
};

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema);

export default User;