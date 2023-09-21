import { ApplicationError } from '@/protocols';

export function notFoundError(message?: string): ApplicationError {
  const errMessage = !message ? 'No result for this search!' : message;
  return {
    name: 'NotFoundError',
    message: `${errMessage}`,
  };
}
