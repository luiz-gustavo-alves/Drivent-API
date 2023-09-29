import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const hotels = await hotelsService.getAllHotels();
  res.status(httpStatus.OK).send(hotels);
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.params;

  const hotel = await hotelsService.getHotelById(Number(hotelId));
  res.status(httpStatus.OK).send(hotel);
}
