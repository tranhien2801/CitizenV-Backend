const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const UnitShema = new Schema (
    {
        nameUnit: { type: String, required: true }, 
        code: { type: String, required: true },
        password: { type: String},
        population: {type: Number},
        idParent: { type: mongoose.Types.ObjectId },
    },
    {
        timestamps: true,
    },
);

UnitShema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Unit', UnitShema);


