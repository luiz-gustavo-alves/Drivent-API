import { hotelsRepository } from '@/repositories';
import { validateUserTicket } from '@/utils/validate-utils';
import { notFoundError } from '@/errors';

async function getAllHotels(userId: number) {
  await validateUserTicket(userId, 'notFound', true);

  const hotels = await hotelsRepository.findAllHotels();
  if (hotels.length === 0) throw notFoundError('No hotels found.');

  return hotels;
}

async function getHotelRooms(hotelId: number, userId: number) {
  const hotel = await hotelsRepository.findHotelById(hotelId);
  if (!hotel) throw notFoundError('No hotel found from requested id');

  await validateUserTicket(userId, 'notFound', true);

  const hotelRooms = await hotelsRepository.findHotelRooms(hotelId);
  return hotelRooms;
}

export const hotelsService = {
  getAllHotels,
  getHotelRooms,
};
