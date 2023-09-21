import { ApplicationError } from '@/protocols';

export function ticketsNotFound(): ApplicationError {
  return {
    name: 'TicketsNotFoundError',
    message: 'No tickets found from search result!',
  };
}
