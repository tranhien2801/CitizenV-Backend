const mocha = require('mocha');
const assert = require('assert');
const mongoose = require('mongoose');
const City = require('../models/City');

describe('Sub document', function () {
    
    it('Lay thanh pho', function() {
        City.findOne({ Name: 'Ninh Bình'})
            .then(function(result) {
                assert(result.Districts.length === 1);
            });
    });
});