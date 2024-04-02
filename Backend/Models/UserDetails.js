const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const UserInfo = mongoose.Schema(
    {
        user_id: {
            type: String,
            require: true
        },
        user_name: {
            type: String,
            required: true,
        },
        user_email: {
            type: String,
            required: true,
        },
        user_password: {
            type: String,
            required: true
        },
        user_status: {
            type: Number,
            required: true
        },
        user_token: {
            type: String,
            required: false
        }

        // user_timestamp: {
        //     type: String,
        //     required: true
        // }

    },
    {
        timestamps: true,
        toJSON: { virtual: true },
        toObject: { virtual: true }
    }
)
UserInfo.pre('save', async function (next) {
    const user = this;
    if (user.isModified('user_password')) {
        user.user_password = await bcrypt.hash(user.user_password, 8)
    }
    next();
})
UserInfo.methods.isPasswordMatch = function (password) {
    const user = this;

    return bcrypt.compareSync(password, user.user_password);
}
module.exports = mongoose.model('SpotifyUserCredentials', UserInfo)