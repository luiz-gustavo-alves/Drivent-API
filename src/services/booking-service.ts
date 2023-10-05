import { cannotProocedBookingError, notFoundError, roomCapacityExceedError } from '@/errors';
import { bookingRepository } from '@/repositories';
import { validateUserTicket } from '@/utils/validate-utils';

async function getBooking(userId: number) {
  const bookingRoom = await bookingRepository.getBookingAndRoomByUserId(userId);
  if (!bookingRoom) throw notFoundError('Booking not found.');

  return bookingRoom;
}

async function makeBooking(roomId: number, userId: number) {
  await validateUserTicket(userId, 'forbidden', true);
  await validateRoomBooking(roomId, userId, 'makeBooking');

  const booking = await bookingRepository.create(roomId, userId);
  return { bookingId: booking.roomId };
}

async function tradeBooking(roomId: number, userId: number, bookingId: number) {
  await validateRoomBooking(roomId, userId, 'tradeBooking', bookingId);

  const newBooking = await bookingRepository.tradeBooking(roomId, bookingId);
  return { bookingId: newBooking.id };
}

async function validateRoomBooking(
  roomId: number,
  userId: number,
  status: 'makeBooking' | 'tradeBooking',
  bookingId?: number,
) {
  if (!Number(roomId) || roomId <= 0) throw notFoundError('Room not found.');

  const room = await bookingRepository.getRoomById(roomId);
  if (!room) throw notFoundError('Room not found.');

  if (status === 'makeBooking') {
    const booking = await bookingRepository.getBookingByRoomAndUserId(roomId, userId);
    if (booking) throw cannotProocedBookingError();
  }

  if (status === 'tradeBooking') {
    if (!bookingId) throw cannotProocedBookingError();

    const booking = await bookingRepository.getBookingById(bookingId);
    if (!booking || booking.userId !== userId || booking.roomId === room.id) throw cannotProocedBookingError();
  }

  const bookingsCounter = await bookingRepository.getBookingsCounterByRoomId(room.id);
  if (bookingsCounter >= room.capacity) throw roomCapacityExceedError();
}

export type RoomId = { roomId: number };

export const bookingService = {
  getBooking,
  makeBooking,
  tradeBooking,
};
