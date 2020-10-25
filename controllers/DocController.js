import Doc from './../models/doc.js';
import express from 'express';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import Conf from '../config.js';

var docRouter = express.Router();

docRouter.use(bodyParser.urlencoded({ extended: false }));
docRouter.use(bodyParser.json());

//CREATE doc
docRouter.post('/create', async (req,res) => {

     //header apabila akan melakukan akses
     var token = req.headers['x-access-token'];
     if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
     
     //verifikasi jwt
     jwt.verify(token, Conf.secret, async function(err, decoded) {
         if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
         const jabatan = decoded.user.jabatan;
         console.log(jabatan)
             if(jabatan !== 0){
                try {
                    const {kategori, nomer, redaksi, tujuan, tanggal, status, keterangan} = req.body;
            
                    const doc = new Doc({
                        kategori,
                        nomer,
                        tujuan,
                        redaksi,
                        tanggal,
                        status : 0,
                        keterangan,
                    });
            
                    const createDoc = await doc.save();
            
                    res.status(201).json(createDoc);
                } catch (err) {
                    console.log(err)
                    res.status(500).json({ error: 'Doc creation failed'});
                }   
             } else {
                 
                 res.status(500).send(`${decoded.user.username} Tidak Memiliki Wewenang`);
             }
         })


    
});

//READ all doc
docRouter.get('/all', async (req,res) => {


     //header apabila akan melakukan akses
     var token = req.headers['x-access-token'];
     if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
     
     //verifikasi jwt
     jwt.verify(token, Conf.secret, async function(err, decoded) {
         if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
         const jabatan = decoded.user.jabatan;
             if( jabatan !== ''){
                const doc =  await Doc.find({});

                if(doc && doc.length !== 0) {
                    res.json(doc)
                } else {
                    res.status(404).json({
                        message: 'Doc not found'
                    });
                }        
             } else {
                 
                 res.status(500).send(`${decoded.user.username} Tidak Memiliki Wewenang`);
             }
         })

   
});

export default docRouter;