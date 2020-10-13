const Joi = require('@hapi/joi');

const registerValidation = body => {
    const schema = Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });

    return schema.validate(body);
}

const loginValidation = body => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });

    return schema.validate(body);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;