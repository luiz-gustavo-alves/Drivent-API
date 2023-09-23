import Joi from 'joi';
import { CreateMakeTicketPayment, GetTicketPaymentDetails } from '@/services';

const numberValidationSchema = Joi.string().min(13).max(16).custom(joiValidateNumberString).required();

const expirationDateSchema = Joi.string().custom(joiExpirationDateValidation).required();

const cvvValidationSchema = Joi.string().length(3).custom(joiValidateNumberString).required();

export const paymentBodySchema = Joi.object<CreateMakeTicketPayment>({
  ticketId: Joi.number().greater(0).required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: numberValidationSchema,
    name: Joi.string().max(128).required(),
    expirationDate: expirationDateSchema,
    cvv: cvvValidationSchema,
  }).required(),
});

export const paymentQuerySchema = Joi.object<GetTicketPaymentDetails>({
  ticketId: Joi.number().greater(0).required(),
});

function joiValidateNumberString(value: string, helpers: Joi.CustomHelpers<string>) {
  if (!value) return value;

  const regexNumber = /^\d+$/;
  const validNumberString = regexNumber.test(value);

  if (!validNumberString) {
    return helpers.error('any.invalid');
  }

  return value;
}

function joiExpirationDateValidation(value: string, helpers: Joi.CustomHelpers<string>) {
  if (!value) return value;

  const month = Number(value.split('/')[0]);
  const validMonth = month > 0 && month < 13;

  if (!validMonth) {
    return helpers.error('any.invalid');
  }

  if (month < 10) {
    value = `0${value}`;
  }

  const regexDateFormat = /^\d{2}\/\d{4}$/;
  const validDateFormat = regexDateFormat.test(value);

  if (!validDateFormat) {
    return helpers.error('any.invalid');
  }

  return value;
}
