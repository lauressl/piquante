const ModelsSauce = require('../models/modelsSauce');

const fs = require('fs');


exports.getAllSauces = (req, res, next) => {
    ModelsSauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    ModelsSauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    if (!sauceObject.name || !sauceObject.manufacturer || !sauceObject.description || !sauceObject.mainPepper || !sauceObject.heat)
    {
        return res.status(400).json({error : "something is missing"})
    }
    //create new sauce
    const sauce = new ModelsSauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      
    });
    console.log(sauce)
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    ModelsSauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    ModelsSauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;

    function gestionDeLikes(sauce) {
        if (like === -1) {
            if (!(sauce.usersLiked.includes(userId)) && !(sauce.usersDisliked.includes(userId))){
                console.log(`La personne dislike la sauce ${sauceId}`)
                sauce.usersDisliked.push(userId)
                sauce.dislikes++
                sauce.save()
                console.log(sauce)
                res.status(200).json({ message: "Vous n'aimez pas la sauce !"})
            }
            else {
                res.status(403).json({error : "Vous ne pouvez pas dislike la sauce"})
            }
        }
        else if (like === 1) {
            if (!sauce.usersLiked.includes(userId) && !sauce.usersDisliked.includes(userId)){
                console.log(`La personne like la sauce ${sauceId}`)
                sauce.usersLiked.push(userId)
                sauce.likes++
                sauce.save()
                console.log(sauce)
                res.status(200).json({ message: "Vous aimez la sauce !"})

            }
            else {
                res.status(403).json({error : "Vous ne pouvez pas like la sauce"})
            }
        }
        else if (like === 0) {
           console.log(`La personne unlike la sauce ${sauceId}`)
           if (sauce.usersLiked.includes(userId)){
              const usersLikedPosition = sauce.usersLiked.indexOf(userId)
              sauce.usersLiked.splice(usersLikedPosition, 1)
              sauce.likes--
              sauce.save()
              console.log(sauce)
              res.status(200).json({ message: "Vous avez retiré votre like !"})
           }
           else if (sauce.usersDisliked.includes(userId)){
            const usersDislikedPosition = sauce.usersDisliked.indexOf(userId)
            sauce.usersDisliked.splice(usersDislikedPosition, 1)
            sauce.dislikes--
            sauce.save()
            console.log(sauce)
            res.status(200).json({ message: "Vous avez retiré votre dislike !"})

            }
            else {
                res.status(403).json({error : "Vous avez déja retiré votre vote"})
            }
        }
        else {
            res.status(400).json({error : "valeur de like non valide"})
        }
     }

    //verify if sauceId = valid format for mongoDB
    const validSauceId = require('mongoose').Types.ObjectId;
    if (validSauceId.isValid(sauceId) === true){
        ModelsSauce.findOne({ _id: sauceId })
        .then((sauce) => {
            if (!sauce) {
                return res.status(404).json({"error" : "Sauce non trouvée"})
            }

            else {
                gestionDeLikes(sauce)
            }
        })
        .catch(error => res.status(400).json({ error }));
    }
    else res.status(400).json({error : "L'id n'est pas au bon format"})
};