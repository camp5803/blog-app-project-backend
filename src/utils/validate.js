import Joi from 'joi';

const emailValidate = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const passwordValidate = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
const nicknameValidate = /^[A-Za-z0-9가-힣]*$/;

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
        nickname: Joi.string()
            .max(45)
            .pattern(nicknameValidate)
            .required(),
        loginType: Joi.number()
    }),
    login: Joi.object({
        email: Joi.string()
            .max(45)
            .pattern(emailValidate)
            .required(),
        password: Joi.string()
            .min(8)
            .pattern(passwordValidate)
            .required()
    }),
    keyword: Joi.string().max(45).required(),
    email: Joi.string()
        .max(45)
        .pattern(emailValidate)
        .required(),
    nickname: Joi.string().max(45).pattern(nicknameValidate).required(),
    password: Joi.string()
        .min(8)
        .pattern(passwordValidate)
        .required()
}