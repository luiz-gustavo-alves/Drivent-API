import { Router } from 'express';
import { getTicketPaymentDetails, postMakeTicketPayment } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { paymentSchema } from '@/schemas';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', getTicketPaymentDetails)
  .post('/process', validateBody(paymentSchema), postMakeTicketPayment);

export { paymentsRouter };
