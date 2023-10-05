import { ApplicationError } from '@/protocols';

export function cannotProocedBookingError(): ApplicationError {
  return {
    name: 'CannotProocedBookingError',
    message: 'Cannot prooced booking request.',
  };
}
