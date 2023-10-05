import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingService, RoomId } from '@/services';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const bookingRoom = await bookingService.getBooking(userId);
  res.status(httpStatus.OK).send(bookingRoom);
}

export async function postMakeBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body as RoomId;

  const bookingId = await bookingService.makeBooking(Number(roomId), userId);
  res.status(httpStatus.OK).send(bookingId);
}

export async function putTradeBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body as RoomId;
  const { bookingId } = req.params;

  const newBookingId = await bookingService.tradeBooking(roomId, userId, Number(bookingId));
  res.status(httpStatus.OK).send(newBookingId);
}
