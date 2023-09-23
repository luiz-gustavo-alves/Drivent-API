import { enrollmentRepository, ticketsRepository, paymentRepository } from '@/repositories';
import { notFoundError, unauthorizedError } from '@/errors';

async function makeTicketPayment(params: CreateMakeTicketPayment, userId: number) {
  const { ticketId } = params;

  const ticket = await ticketsRepository.findTicketById(ticketId);
  if (!ticket) throw notFoundError('No ticket found from requested search.');

  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (ticket.enrollmentId !== enrollment.id) throw unauthorizedError();

  const ticketType = await ticketsRepository.findTicketTypeById(ticket.ticketTypeId);
  const { price } = ticketType;

  const { issuer, number } = params.cardData;
  const paymentParams = {
    ticketId,
    value: price,
    cardIssuer: issuer,
    cardLastDigits: number.slice(-4),
  };

  return await paymentRepository.createMakeTicketPayment(paymentParams);
}

type CardDataParams = {
  issuer: string;
  number: string;
  name: string;
  expirationDate: string;
  cvv: string;
};

export type CreateMakeTicketPayment = CardDataParams & {
  ticketId: number;
  cardData: CardDataParams;
};

export const paymentService = {
  makeTicketPayment,
};
