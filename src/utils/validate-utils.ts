/* eslint-disable prettier/prettier */
import { ticketsRepository, enrollmentRepository } from '@/repositories';
import { cannotProocedBookingError, conflictError, notFoundError, paymentRequiredError } from '@/errors';

export async function validateUserTicket(
  userId: number,
  error: 'notFound' | 'conflict' | 'forbidden',
  checkHotel = false,
) {
  const enrollmentErrors = {
    'notFound': () => notFoundError('No enrollments found from user.'),
    'forbidden': () => cannotProocedBookingError(),
  };

  const ticketsErrors = {
    'notFound': () => notFoundError('No enrollments found from user.'),
    'conflict': () => conflictError('There is already a ticket from user enrollment'),
    'forbidden': () => cannotProocedBookingError(),
  };

  const ticketTypeErrors = {
    'forbidden': () => cannotProocedBookingError(),
    'payment': () => paymentRequiredError(),
  };

  const enrollmentError = error === 'forbidden' ? enrollmentErrors['forbidden'] : enrollmentErrors['notFound'];
  const ticketTypeError = error === 'forbidden' ? ticketTypeErrors['forbidden'] : ticketTypeErrors['payment'];
  const ticketError = ticketsErrors[error];

  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw enrollmentError();

  const ticketByEnrollment = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (ticketByEnrollment && error !== 'notFound') throw ticketError();
  if (!ticketByEnrollment && error === 'notFound') throw ticketError();

  if (checkHotel) {
    const ticketType = await ticketsRepository.findTicketTypeById(ticketByEnrollment.ticketTypeId);
    if (ticketType.isRemote || !ticketType.includesHotel || ticketByEnrollment.status !== 'PAID') {
      throw ticketTypeError();
    }
  }

  return { enrollment, ticketByEnrollment };
}
