const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const CitizenSchema = new Schema(
    {
        CCCD: { type: String, unique: true, required: true, length: 12 },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        dob: { type: Date, max: Date.now},
        sex: { type: String},
        hometown: { type: String},
        perResidence: { type: String},
        curResidence: { type: String},
        religion: { type: String},
        eduLevel: { type: String},
        job: { type: String},
        phone: { type: String},
        addressID: { type: String },
    },
    {
        timestamps: true,
    },
);


CitizenSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});



module.exports = mongoose.model('Citizen', CitizenSchema);
