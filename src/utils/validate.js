import Joi from 'joi';

const emailValidate = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/g;
const passwordValidate = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;

export const validateSchema = {
    signUp: Joi.object({
        email: Joi.string()
            .max(45)
            .pattern(emailValidate)
            .required(),
        password: Joi.string()
            .min(8)
            .pattern(passwordValidate)
            .required(),
        nickname: Joi.string().max(45).required(),
        image_url: Joi.string()
    }),
    signIn: Joi.object({
        email: Joi.string()
            .max(45)
            .pattern(emailValidate)
            .required(),
        password: Joi.string()
            .min(8)
            .pattern(passwordValidate)
            .required()
    }),
    preference: Joi.object({
        darkmode_status: Joi.boolean(),
        neighbor_alert: Joi.boolean(),
        comment_alert: Joi.boolean(),
        chat_alert: Joi.boolean()
    }),
    keyword: Joi.String().max(45).required(),
    email: Joi.string()
        .max(45)
        .pattern(emailValidate)
        .required(),
    nickname: Joi.string().max(45).required(),
    password: Joi.string()
        .min(8)
        .pattern(passwordValidate)
        .required()
}