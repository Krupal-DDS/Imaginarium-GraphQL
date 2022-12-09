const mongoose = require("mongoose");

const bookdata = mongoose.Schema({
    bookbanner: {
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
    writers: [
        {
            writername: String,
            writerDescription: String,
        },
    ],
    author: {
        type: mongoose.Schema.Types.String,
        ref: "UserAuth",
        require: true,
    },
    tags: [String],
    genres: [],
    similarBooks: [
        {
            bookbanner: String,
            bookname: String
        },
    ],
    manuscript: [{
        actName: String,
        chapters: [{
            chapterName: { type: String, default: 'Please Enter Chapter Title' },
            description: { type: String, default: 'Please Enter Chapter Description' },
            writers: [{
                writername: String,
                writerDescription: String,
            }]
        }]
    }],
});

module.exports = mongoose.model("Bookdata", bookdata);


