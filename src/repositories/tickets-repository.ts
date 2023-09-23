import { prisma } from '@/config';

async function findTicketTypeById(ticketTypeId: number) {
  return await prisma.ticketType.findUnique({
    where: { id: ticketTypeId },
  });
}

async function findTicketByEnrollmentId(enrollmentId: number) {
  return await prisma.ticket.findUnique({
    where: { enrollmentId: enrollmentId },
  });
}

async function findTicketById(ticketId: number) {
  return await prisma.ticket.findUnique({
    where: { id: ticketId },
  });
}

async function findTicketsType() {
  return await prisma.ticketType.findMany();
}

async function createTicket(ticketTypeId: number, enrollmentId: number) {
  return await prisma.ticket.create({
    data: {
      status: 'RESERVED',
      ticketTypeId,
      enrollmentId,
    },
  });
}

export const ticketsRepository = {
  findTicketTypeById,
  findTicketByEnrollmentId,
  findTicketById,
  findTicketsType,
  createTicket,
};
