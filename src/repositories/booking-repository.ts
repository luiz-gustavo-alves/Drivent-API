import { prisma } from '@/config';

async function getRoomById(roomId: number) {
  return await prisma.room.findUnique({
    where: { id: roomId },
  });
}

async function getBookingAndRoomByUserId(userId: number) {
  const booking = await prisma.booking.findFirst({
    where: { userId: userId },
  });

  const room = await prisma.room.findUnique({
    where: { id: booking.roomId },
  });

  return { id: booking.id, Room: room };
}

async function getBookingById(bookingId: number) {
  return await prisma.booking.findUnique({
    where: { id: bookingId },
  });
}

async function getBookingByRoomAndUserId(roomId: number, userId: number) {
  return await prisma.booking.findFirst({
    where: {
      userId: userId,
      roomId: roomId,
    },
  });
}

async function getBookingsCounterByRoomId(roomId: number) {
  const counter = await prisma.booking.aggregate({
    _count: { id: true },
    where: { roomId: roomId },
    orderBy: { id: 'asc' },
  });

  const bookingsCounter = counter._count.id;
  return bookingsCounter;
}

async function create(roomId: number, userId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

async function tradeBooking(roomId: number, bookingId: number) {
  return await prisma.booking.update({
    where: { id: bookingId },
    data: { roomId },
  });
}

export const bookingRepository = {
  getRoomById,
  getBookingAndRoomByUserId,
  getBookingById,
  getBookingByRoomAndUserId,
  getBookingsCounterByRoomId,
  create,
  tradeBooking,
};
