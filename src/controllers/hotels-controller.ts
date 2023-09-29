import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const hotels = await hotelsService.getAllHotels(userId);
  res.status(httpStatus.OK).send(hotels);
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.params;
  const { userId } = req;

  const hotelRooms = await hotelsService.getHotelRooms(Number(hotelId), userId);
  res.status(httpStatus.OK).send(hotelRooms);
}
