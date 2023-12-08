const minionsRouter = require('express').Router();
const Joi = require('joi');

module.exports = minionsRouter;

const {
    getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabasebyId,
} = require('./db');

// set minion parameters
minionsRouter.param('minionId', (req, res, next, id) => {
    const minion = getFromDatabaseById('minions', id);
    if (minion) {
        req.minion = minion;
        next();
    } else {
        res.status(404).send("Minion with given ID no found");
    }
})

// GET array of all minions
minionsRouter.get('/', (req, res, next) => {
    res.send(getAllFromDatabase('minions'));
});

// GET minion by id
minionsRouter.get('/:minionId', (req, res, next) => {
    res.send(req.minion);
});

// POST new minion to db
minionsRouter.post('/', (req, res, next) => {
    const { error } = validateMinion(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const newMinion = addToDatabase('minions', req.body);
    res.status(201).send(newMinion); 
})

// PUT to edit minion by id
minionsRouter.put('/:minionId', (req, res, next) => {
    // const { error } = validateMinion(req.body);
    // if (error) {
    //     return res.status(400).send(error.details[0].message)
    // }
    const updatedMinion = updateInstanceInDatabase('minions', req.body);
    res.status(200).send(updatedMinion);
});

// DELETE minion by id
minionsRouter.delete('/:minionId', (req, res, next) => {
    const deletedMinion = deleteFromDatabasebyId('minions', req.minion.id);
    res.status(204).send(deletedMinion);
});

// Validation
const validateMinion = (minion) => {
    const schema = Joi.object({
        name: Joi.string().min(3).trim().required(),
        title: Joi.string().min(3).trim().required(),
        weaknesses: Joi.string().required(),
        salary: Joi.number().required(),
    });

    return schema.validate(minion);
}