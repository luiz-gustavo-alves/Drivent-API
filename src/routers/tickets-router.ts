import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketsFromUser, getTicketsType, postCreateTicket } from '@/controllers';
import { ticketTypeSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/', getTicketsFromUser)
  .get('/types', getTicketsType)
  .post('/', validateBody(ticketTypeSchema), postCreateTicket);

export { ticketsRouter };
