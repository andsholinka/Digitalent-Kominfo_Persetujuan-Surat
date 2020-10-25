import mongoose from 'mongoose';

const DocSchema = mongoose.Schema(
    {
        kategori: {
            type: String,
            required: true,
        },
        nomer: {
            type: String,
            required: true,            
        },
        redaksi: {
            type: String,
            required: true,         
        },
        tanggal: {
            type: String,
            required: true,   
        },
        tujuan: {
            type: String,
            required: true,         
        },
        status: {
            type: Number,
            required: true,         
        },
        keterangan: {
            type: String,
            required: true,         
        }
    },
    {
        timestamps: false,
    }
);

const Doc = mongoose.model('Doc', DocSchema);

export default Doc;