const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WardShema = new Schema (
    {
        Id: { type: String, required: true},
        Name: { type: String, required: true},
    }
);
const DistrictSchema = new Schema (
    {
        Id: { type: String, required: true},
        Name: { type: String, required: true},
        Wards: [WardShema],
    }
);
const ProvinceChema = new Schema ( 
    { 
        Id: { type: String, required: true },
        Name: { type: String, required: true },
        Districts: [DistrictSchema],
    },
    {
        timestamps: true,
    },
);



module.exports = mongoose.model('City', ProvinceChema);