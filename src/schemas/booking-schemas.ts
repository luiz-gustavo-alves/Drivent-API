import Joi from 'joi';
import { BookingBodySchema, BookingParamsSchema } from '@/services';

export const bookingBodySchema = Joi.object<BookingBodySchema>({
  roomId: Joi.number().greater(0).required(),
});

export const bookingParamsSchema = Joi.object<BookingParamsSchema>({
  bookingId: Joi.number().greater(0).required(),
});
