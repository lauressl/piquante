const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const User = require('../models/modelUser');

exports.signup = (req, res, next) => {
    //VALIDATOR
    let validateMail = validator.isEmail(req.body.email)
    let validatePwd = validator.isStrongPassword(req.body.password)
    if ((validateMail === true) && (validatePwd === true)){
        //create hash for passord (10 = number of hash makes)
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //create new user with ID and hashed password
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // save user infos in DB
            user.save()
            .then(() => res.status(201).json({ message:'Utilisateur créé !'}))
            .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
    }
    else{
        res.status(401).json({ message:'email ou mot de passe non valide'});
    }
};
exports.login = (req, res, next) => {

    //Find user in DB
    User.findOne({ email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "Utilisateur non trouvé"});
            }
            //Compare input password with password in DB
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect"});
                    }
                    //If inputs are correct, return infos to frontend
                    res.status(200).json({
                        //Encode userId too to ensure security of user when created new product
                        userId: user._id,
                        //Create token 
                        token: jwt.sign(
                            { userId: user._id},
                            process.env.SECRET_TOKEN,
                            { expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({ error}));
};
