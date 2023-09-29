import { prisma } from '@/config';

async function findAllHotels() {
  return await prisma.hotel.findMany();
}

export const hotelsRepository = {
  findAllHotels,
};
