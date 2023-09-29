import { ticketsRepository, enrollmentRepository } from '@/repositories';
import { conflictError, notFoundError } from '@/errors';

export async function validateTicketEnrollment(userId: number, ticketError: 'notFound' | 'conflict') {
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw notFoundError('No enrollments found from user.');

  const ticketByEnrollment = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (ticketError === 'notFound' && !ticketByEnrollment) {
    throw notFoundError('No ticket from user enrollment');
  }

  if (ticketError === 'conflict' && ticketByEnrollment) {
    throw conflictError('There is already a ticket from user enrollment');
  }

  return { enrollment, ticketByEnrollment };
}
