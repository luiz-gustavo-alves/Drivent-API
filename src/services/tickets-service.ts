import { Ticket, TicketType } from '@prisma/client';
import { ticketsRepository, enrollmentRepository } from '@/repositories';
import { conflictError, notFoundError } from '@/errors';

export type CreateTicket = Pick<Ticket, 'ticketTypeId'>;
export type TicketWithTypeDetails = Ticket & { TicketType: TicketType };

async function getTicketsFromUser() {
  return;
}

async function getTicketsType() {
  return;
}

async function createTicket(params: CreateTicket, userId: number): Promise<TicketWithTypeDetails> {
  const { ticketTypeId } = params;

  const ticketType = await ticketsRepository.findTicketTypeById(ticketTypeId);
  if (!ticketType) throw notFoundError('No tickets found from requested search.');

  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw notFoundError('No enrollments found from user.');

  const enrollmentId = enrollment.id;

  const duplicateEnrollment = await ticketsRepository.findTicketByEnrollmentId(enrollmentId);
  if (duplicateEnrollment) throw conflictError('There is already a ticket from user enrollment');

  const ticket = await ticketsRepository.createTicket(ticketTypeId, enrollmentId);
  return { ...ticket, TicketType: ticketType };
}

export const ticketsService = {
  getTicketsFromUser,
  getTicketsType,
  createTicket,
};
