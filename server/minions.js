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
    const { error } = validateMinion(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const updatedMinion = updateInstanceInDatabase('minions', req.body);
    res.status(200).send(updatedMinion);
});

// DELETE minion by id
minionsRouter.delete('/:minionId', (req, res, next) => {
    const deletedMinion = deleteFromDatabasebyId('minions', req.minion.id);
    res.status(204).send(deletedMinion);
});


// --- Work Routes ---

// GET all work by minion ID
minionsRouter.get('/:minionId/work', (req, res, next) => {
    const allWork = getAllFromDatabase('work');
    const selectedMinionsWork = allWork.filter(work => {
        work.minionId === req.params.minionId
    });
    res.send(selectedMinionsWork);
})

// POST new work by minion ID
minionsRouter.post('/:minionId/work', (req, res, next) => {
    const { error } = validateWork(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const work = req.body;
    work.minionId = req.params.minionId;
    const newWork = addToDatabase('work', work);
    res.send(newWork);
})

// set work params
minionsRouter.use('workId', (req, res, next, id) => {
    const workId = getFromDatabaseById('work', id);
    if (workId !== -1) {
        req.work = workId;
        next();
    } else {
        res.status(404).send('Work with given ID not found')
    }
})

// PUT update minion work by work id
minionsRouter.put('/:minionId/work/:workId', (req, res, next) => {
    const { error } = validateWork(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    if (req.params.minionId !== req.body.minionId) {
        return res.status(400).send('minion with given ID not found');
    }

    const updatedWork = updateInstanceInDatabase('work', req.body);
    res.send(updatedWork);
});

// DELETE work by ID
minionsRouter.delete('/:minionId/work/:workId', (req, res, next) => {
    if (req.params.minionId !== req.body.minionId) {
        return res.status(400).send('minion with given ID not found');
    }

    const deletedWork = deleteFromDatabasebyId('work', req.params.workId);
    res.send(deletedWork);
})

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

const validateWork = (work) => {
    const schema = Joi.object({
        title: Joi.string().min(3).trim().required(),
        description: Joi.string().min(3).trim().required(),
        hours: Joi.number().required(),
        minionId: Joi.string().required(),
    });

    return schema.validate(work);
}