import { cannotProocedBookingError, notFoundError, roomCapacityExceedError } from '@/errors';
import { bookingRepository } from '@/repositories';
import { validateUserTicket } from '@/utils/validate-utils';

async function makeBooking(roomId: number, userId: number) {
  await validateUserTicket(userId, 'forbidden', true);
  await validateRoomBooking(roomId, userId);

  const booking = await bookingRepository.create(roomId, userId);
  return { bookingId: booking.roomId };
}

async function validateRoomBooking(roomId: number, userId: number) {
  if (!Number(roomId) || roomId <= 0) throw notFoundError('Room not found.');

  const room = await bookingRepository.getRoomById(roomId);
  if (!room) throw notFoundError('Room not found.');

  /* User already has room booking */
  const booking = await bookingRepository.getBookingByRoomAndUserId(roomId, userId);
  if (booking) throw cannotProocedBookingError();

  const bookingsCounter = await bookingRepository.getBookingsCounterByRoomId(room.id);
  if (bookingsCounter >= room.capacity) throw roomCapacityExceedError();
}

export type RoomId = {
  roomId: number;
};

export const bookingService = {
  makeBooking,
};
