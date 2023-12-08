const meetingsRouter = require('express').Router();
const Joi = require('joi');

module.exports = meetingsRouter;

const {
    getAllFromDatabase,
    createMeeting,
    deleteAllFromDatabase,
} = require('./db');

// GET all meetings
meetingsRouter.get('/', (req, res, next) => {
    res.send(getAllFromDatabase('meetings'));
});

// POST a new meeting
meetingsRouter.post('/', (req, res, next) => {
    const newMeeting = createMeeting();
    res.status(201).send(newMeeting);
});

// DELETE all meetings
meetingsRouter.delete('/', (req, res, next) => {
    res.send(deleteAllFromDatabase('meetings'));
})

// --- Not Needed ---
// 
// const validateMeeting = (meeting) => {
//     const scehma = Joi.object({
//         time: Joi.string().min(5).max(5).required(),
//         date: Joi.string().required(),
//         day: Joi.string().required(),
//         note: Joi.string().required(),
//     })

//     return scehma.validate(meeting);
// }