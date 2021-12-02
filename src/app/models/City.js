const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const VillageSchema = new Schema(
    {
        Id: { type: String, required: true},
        Name: { type: String, required: true},
        Population: {type: Number},
    }
);

const WardShema = new Schema (
    {
        Id: { type: String, required: true},
        Name: { type: String, required: true},
        Population: {type: Number},
        Villages: [VillageSchema]
    }
);

const DistrictSchema = new Schema (
    {
        Id: { type: String, required: true},
        Name: { type: String, required: true},
        Population: {type: Number},
        Wards: [WardShema],
    }
);

const ProvinceChema = new Schema ( 
    { 
        Id: { type: String, required: true },
        Name: { type: String, required: true },
        Population: {type: Number},
        Districts: [DistrictSchema],
    },
    {
        timestamps: true,
    },
);

ProvinceChema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('City', ProvinceChema);