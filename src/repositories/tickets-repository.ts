import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findTicketTypeById(ticketId: number): Promise<TicketType> {
  return await prisma.ticketType.findUnique({
    where: { id: ticketId },
  });
}

async function findTicketByEnrollmentId(enrollmentId: number): Promise<Ticket> {
  return await prisma.ticket.findUnique({
    where: { enrollmentId: enrollmentId },
  });
}

async function findTicketsType() {
  return await prisma.ticketType.findMany();
}

async function createTicket(ticketTypeId: number, enrollmentId: number): Promise<Ticket> {
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
  findTicketsType,
  createTicket,
};
