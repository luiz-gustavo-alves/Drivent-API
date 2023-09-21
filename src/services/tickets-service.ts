import { Ticket, TicketType } from '@prisma/client';
import { ticketsRepository, enrollmentRepository } from '@/repositories';
import { conflictError, notFoundError } from '@/errors';

export type CreateTicket = Pick<Ticket, 'ticketTypeId'>;
export type TicketWithTypeDetails = Ticket & { TicketType: TicketType };

async function getTicketsFromUser(userId: number) {
  const { ticketByEnrollment } = await validateTicketEnrollment(userId);

  if (!ticketByEnrollment) throw notFoundError('No ticket from user enrollment');
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

  const { enrollment, ticketByEnrollment } = await validateTicketEnrollment(userId);

  if (ticketByEnrollment) throw conflictError('There is already a ticket from user enrollment');

  const ticket = await ticketsRepository.createTicket(ticketTypeId, enrollment.id);
  return { ...ticket, TicketType: ticketType };
}

async function validateTicketEnrollment(userId: number) {
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw notFoundError('No enrollments found from user.');

  const ticketByEnrollment = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  return { enrollment, ticketByEnrollment };
}

export const ticketsService = {
  getTicketsFromUser,
  getTicketsType,
  createTicket,
};
