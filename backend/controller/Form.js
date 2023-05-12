const express = require('express');
const router = express.Router();
const FormSchema = require('../model/Form');

module.exports.newForm = async (composition) => {
    try {
        let Form = new FormSchema(composition);
        let response = await Form.save();
        return {success: true, response};
    } catch(err) {
        console.log(err);
        return {success: false, response: err}
    }
}

