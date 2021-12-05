const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const CitizenSchema = new Schema(
    {
        CCCD: { type: String, unique: true, required: true, },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        sex: { type: String},
        bod: { type: Date},
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
