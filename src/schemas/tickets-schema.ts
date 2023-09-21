import Joi from 'joi';
import { CreateTicket } from '@/services';

export const ticketTypeSchema = Joi.object<CreateTicket>({
  ticketTypeId: Joi.number().required(),
});
