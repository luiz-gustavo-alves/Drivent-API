import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBooking, postMakeBooking, putTradeBooking } from '@/controllers';

const bookingRouter = Router();

// eslint-disable-next-line prettier/prettier
bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .post('/', postMakeBooking)
  .put('/:bookingId', putTradeBooking);

export { bookingRouter };
