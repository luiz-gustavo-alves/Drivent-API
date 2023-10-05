import { prisma } from '@/config';

async function getRoomById(roomId: number) {
  return await prisma.room.findUnique({
    where: { id: roomId },
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

export const bookingRepository = {
  getRoomById,
  getBookingByRoomAndUserId,
  getBookingsCounterByRoomId,
  create,
};
