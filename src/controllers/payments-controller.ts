import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { paymentService } from '@/services';

export async function getTicketPaymentDetails(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketId } = req.query;

  const paymentDetails = await paymentService.getTicketPaymentDetails(Number(ticketId), userId);
  res.status(httpStatus.OK).send(paymentDetails);
}

export async function postMakeTicketPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const paymentDetails = await paymentService.makeTicketPayment(req.body, userId);
  res.status(httpStatus.OK).send(paymentDetails);
}
