import { ApplicationError } from '@/protocols';

export function invalidCepError(message: string): ApplicationError {
  return {
    name: 'InvalidCepError',
    message: message,
  };
}
