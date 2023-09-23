import { Router } from 'express';
import { getTicketPaymentDetails, postMakeTicketPayment } from '@/controllers';
import { authenticateToken, validateBody, validateQuery } from '@/middlewares';
import { paymentBodySchema, paymentQuerySchema } from '@/schemas';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', validateQuery(paymentQuerySchema), getTicketPaymentDetails)
  .post('/process', validateBody(paymentBodySchema), postMakeTicketPayment);

export { paymentsRouter };
