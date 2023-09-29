import { Ticket, TicketType } from '@prisma/client';
import { ticketsRepository } from '@/repositories';
import { notFoundError } from '@/errors';
import { validateTicketEnrollment } from '@/utils/validate-utils';

export type CreateTicket = Pick<Ticket, 'ticketTypeId'>;
export type TicketWithTypeDetails = Ticket & { TicketType: TicketType };

async function getTicketsFromUser(userId: number) {
  const { ticketByEnrollment } = await validateTicketEnrollment(userId, 'notFound');

  const ticketType = await ticketsRepository.findTicketTypeById(ticketByEnrollment.ticketTypeId);
  return { ...ticketByEnrollment, TicketType: ticketType };
}

async function getTicketsType(): Promise<TicketType[]> {
  const ticketsType = await ticketsRepository.findTicketsType();
  return ticketsType;
}

async function createTicket(params: CreateTicket, userId: number): Promise<TicketWithTypeDetails> {
  const { ticketTypeId } = params;

  const ticketType = await ticketsRepository.findTicketTypeById(ticketTypeId);
  if (!ticketType) throw notFoundError('No tickets found from requested search.');

  const { enrollment } = await validateTicketEnrollment(userId, 'conflict');

  const ticket = await ticketsRepository.createTicket(ticketTypeId, enrollment.id);
  return { ...ticket, TicketType: ticketType };
}

export const ticketsService = {
  getTicketsFromUser,
  getTicketsType,
  createTicket,
};
