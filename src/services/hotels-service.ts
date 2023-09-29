import { ticketsRepository, hotelsRepository } from '@/repositories';
import { validateTicketEnrollment } from '@/utils/validate-utils';
import { paymentRequiredError } from '@/errors';

async function getAllHotels(userId: number) {
  await ticketErrorHandler(userId);

  const hotels = await hotelsRepository.findAllHotels();
  return hotels;
}

async function getHotelById(hotelId: number, userId: number) {
  await ticketErrorHandler(userId);

  return;
}

async function ticketErrorHandler(userId: number) {
  const { ticketByEnrollment } = await validateTicketEnrollment(userId, 'notFound');
  if (ticketByEnrollment.status !== 'PAID') throw paymentRequiredError();

  const ticketType = await ticketsRepository.findTicketTypeById(ticketByEnrollment.ticketTypeId);
  if (!ticketType.includesHotel || ticketType.isRemote) throw paymentRequiredError();
}

export const hotelsService = {
  getAllHotels,
  getHotelById,
};
