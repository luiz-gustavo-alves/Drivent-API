import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

async function findAllHotels() {
  return await prisma.hotel.findMany();
}

async function findHotelById(hotelId: number) {
  return await prisma.hotel.findUnique({
    where: { id: hotelId },
  });
}

async function findHotelRooms(hotelId: number): Promise<HotelRooms> {
  const hotel = await findHotelById(hotelId);
  const rooms = await prisma.room.findMany({
    where: { hotelId: hotelId },
  });

  return { ...hotel, Rooms: rooms };
}

export type HotelRooms = Hotel & {
  Rooms: Room[];
};

export const hotelsRepository = {
  findAllHotels,
  findHotelById,
  findHotelRooms,
};
