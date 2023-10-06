import { Router } from 'express';
import { authenticateToken, validateBody, validateParams } from '@/middlewares';
import { getBooking, postMakeBooking, putTradeBooking } from '@/controllers';
import { bookingBodySchema, bookingParamsSchema } from '@/schemas';

const bookingRouter = Router();

// eslint-disable-next-line prettier/prettier
bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .post('/', validateBody(bookingBodySchema), postMakeBooking)
  .put('/:bookingId', validateBody(bookingBodySchema), validateParams(bookingParamsSchema), putTradeBooking);

export { bookingRouter };
