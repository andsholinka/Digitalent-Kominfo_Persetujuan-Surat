import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,            
        },
        jabatan: {
            type: Number,
            required: true,         
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', UserSchema);

export default User;