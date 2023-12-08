const ideasRouter = require('express').Router();
const Joi = require('joi');

module.exports = ideasRouter;

const {
    getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabasebyId,
} = require('./db');

// set params
ideasRouter.use('ideaId', (req, res, next, id) => {
    const idea = getFromDatabaseById('ideas', id);
    if (idea) {
        req.idea = idea;
        next();
    } else {
        res.status(400).send(`Idea with given ID not found`);
    }
})

// GET all ideas
ideasRouter.get('/', (req, res, next) => {
    res.send(getAllFromDatabase('ideas'));
})
// GET idea by ID
ideasRouter.get('/:ideaId', (req, res, next) => {
    res.send(req.idea);
})

// POST new idea
ideasRouter.post('/', (req, res, next) => {
    const { error } = validateIdea(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const newIdea = addToDatabase('ideas', req.body);
    res.status(201).send(newIdea);
})

// PUT update idea by ID
ideasRouter.put('/:ideaId', (req, res, next) => {
    const { error } = validateIdea(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const updatedIdea = updateInstanceInDatabase('ideas', req.body);
    res.status(200).send(updatedIdea);
})

// DELETE idea by ID
ideasRouter.delete('/:ideaId', (req, res, next) => {
    const deletedIdea = deleteFromDatabasebyId('ideas', req.idea)
    res.status(200).send(deletedIdea);
})

// validate ideas
const validateIdea = (idea) => {
    const schema = Joi.object({
        name: Joi.string().min(3).trim().required(),
        description: Joi.string().required(),
        weeklyRevenue: Joi.number().required(),
        numWeeks: Joi.number().required(),
    })

    return schema.validate(idea);
}