import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingService } from '@/services';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  res.send(req.body);
}

export async function postMakeBooking(req: AuthenticatedRequest, res: Response) {
  res.send(req.body);
}

export async function putTradeBooking(req: AuthenticatedRequest, res: Response) {
  res.send(req.body);
}
