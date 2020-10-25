import User from '../models/user.js';
import express from 'express';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import Conf from '../config.js';

var userRouter = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//CREATE user
userRouter.post('/register', async (req, res) => {
    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const jabatan = decoded.user.jabatan;
        console.log(jabatan)
            if(jabatan == 1){
                try{
                    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
            
                    User.create({
                        username : req.body.username,
                        password : hashedPassword,
                        jabatan : req.body.jabatan
                    },
                        function (err, user) {
                        if (err) return res.status(500).send("There was a problem registering the user.")
                        res.status(200).send(`${user} Berhasil Daftar`);
                        }); 
                } 
                catch(error){
                    res.status(500).json({ error: error})
                }
            } else {
                res.status(500).send(`${decoded.user.username} Tidak Memiliki Wewenang`);
            }
    })
})

//READ all data users
userRouter.get('/datauser', async (req,res) => {
    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    const jabatan = decoded.user.jabatan;
    console.log(jabatan)
        if(jabatan == 1){
            const user =  await User.find({});
            if(user && user.length !== 0) {
                res.json(user)
            } else {
                res.status(404).json({
                    message: 'Users not found'
                });
            }
        } else {
            res.status(500).send(`${decoded.user.username} Tidak Memiliki Wewenang`);
        }
    })
});

//READ user by ID
userRouter.get('/datauser/:id', async (req,res) => {

//header apabila akan melakukan akses
var token = req.headers['x-access-token'];
if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

//verifikasi jwt
jwt.verify(token, Conf.secret, async function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    const jabatan = decoded.user.jabatan;
    console.log(jabatan)
        if(jabatan == 1){
            const user = await User.findById(req.params.id);

            if(user) {
                res.json(user)
            } else {
                res.status(404).json({
                    message: 'User not found'
                });
            }
        } else {
            res.status(500).send(`${decoded.user.username} Tidak Memiliki Wewenang`);
        }
    })
});

//UPDATE data user
userRouter.put('/datauser/:id', async (req,res) => {

//header apabila akan melakukan akses
var token = req.headers['x-access-token'];
if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

//verifikasi jwt
jwt.verify(token, Conf.secret, async function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    const jabatan = decoded.user.jabatan;
    console.log(jabatan)
        if(jabatan == 1){
            const {username, password, nbelakang, jabatan} = req.body;

            const user = await User.findById(req.params.id);
        
            if (user) {
        
                var saltRounds = 10;
                const hashedPw = await bcrypt.hash(password, saltRounds);
                user.username = username;
                user.password = hashedPw;
                user.nbelakang = nbelakang;
                user.jabatan = jabatan;
        
                const updateDatauser = await user.save()
        
                res.send(updateDatauser);
            } else {
                res.status(404).json({
                    message: 'User not found'
                })
            }
        } else {
            res.status(500).send(`${decoded.user.username} Tidak Memiliki Wewenang`);
        }
    })
})

export default userRouter;