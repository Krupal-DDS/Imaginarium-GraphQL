const mongoose = require("mongoose");

const seriesdata = mongoose.Schema({
    seriesbanner: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    type: {
        type: String,
        require: true
    },
    logline: {
        incitingIncident: {
            type: String,
        },
        protagonist: {
            type: String,
        },
        action: {
            type: String,
        },
        antagonist: {
            type: String,
        },
    },
    tagline: {
        type: String,
        require: true,
    },
    synopsis: {
        type: String,
        require: true,
    },
    actors: [
        {
            actorImage: String,
            actorname: String,
            heroname: String,
            actorDescription: String,
        },
    ],
    author: {
        type: mongoose.Schema.Types.String,
        ref: "UserAuth",
        require: true,
    },
    tags: [String],
    genres: [],
    similarseries: [
        {
            seriesbanner: String,
            seriesname: String
        },
    ],
    screenplay: [{
        seasonName: String,
        seasonDescription: String,
        Episodes: [{
            episodeName: String,
            Acts: [{
                actName: String,
                Scenes: [{
                    sceneName: { type: String, default: 'Please Enter Scene Title' },
                    description: { type: String, default: 'Please Enter Scene Description' },
                    actors: [{
                        actorImage: String,
                        actorname: String,
                        heroname: String,
                        actorDescription: String,
                    }]
                }]
            }]

        }]

    }],
});

module.exports = mongoose.model("Seriesdata", seriesdata);


