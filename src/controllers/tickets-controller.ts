import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';

export async function getTicketsFromUser(req: AuthenticatedRequest, res: Response) {
  return res.send(httpStatus.OK);
}

export async function getTicketsType(req: AuthenticatedRequest, res: Response) {
  return res.send(httpStatus.OK);
}

export async function postCreateTicket(req: AuthenticatedRequest, res: Response) {
  return res.send(httpStatus.OK);
}
