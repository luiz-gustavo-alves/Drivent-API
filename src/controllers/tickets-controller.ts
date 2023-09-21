import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services';

export async function getTicketsFromUser(req: AuthenticatedRequest, res: Response) {
  return res.send(httpStatus.OK);
}

export async function getTicketsType(req: AuthenticatedRequest, res: Response) {
  return res.send(httpStatus.OK);
}

export async function postCreateTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const ticket = await ticketsService.createTicket(req.body, userId);
  return res.status(httpStatus.CREATED).send(ticket);
}
