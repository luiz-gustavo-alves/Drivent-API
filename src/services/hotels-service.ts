import { ticketsRepository, hotelsRepository } from '@/repositories';
import { validateTicketEnrollment } from '@/utils/validate-utils';
import { notFoundError, paymentRequiredError } from '@/errors';

async function getAllHotels(userId: number) {
  await ticketErrorHandler(userId);

  const hotels = await hotelsRepository.findAllHotels();
  if (!hotels) throw notFoundError('No hotels found.');

  return hotels;
}

async function getHotelRooms(hotelId: number, userId: number) {
  await ticketErrorHandler(userId);

  const hotelRooms = await hotelsRepository.findHotelRooms(hotelId);
  if (hotelRooms.Rooms.length === 0) throw notFoundError('No hotel rooms found.');

  return hotelRooms;
}

async function ticketErrorHandler(userId: number) {
  const { ticketByEnrollment } = await validateTicketEnrollment(userId, 'notFound');
  if (ticketByEnrollment.status !== 'PAID') throw paymentRequiredError();

  const ticketType = await ticketsRepository.findTicketTypeById(ticketByEnrollment.ticketTypeId);
  if (!ticketType.includesHotel || ticketType.isRemote) throw paymentRequiredError();
}

export const hotelsService = {
  getAllHotels,
  getHotelRooms,
};
