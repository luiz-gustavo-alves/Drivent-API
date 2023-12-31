import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services';

export async function getTicketsFromUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const tickets = await ticketsService.getTicketsFromUser(userId);
  return res.status(httpStatus.OK).send(tickets);
}

export async function getTicketsType(req: AuthenticatedRequest, res: Response) {
  const ticketsType = await ticketsService.getTicketsType();
  return res.status(httpStatus.OK).send(ticketsType);
}

export async function postCreateTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const ticket = await ticketsService.createTicket(req.body, userId);
  return res.status(httpStatus.CREATED).send(ticket);
}
