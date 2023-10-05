import { ApplicationError } from '@/protocols';

export function roomCapacityExceedError(): ApplicationError {
  return {
    name: 'RoomCapacityExceedError',
    message: 'Room maximum capacity exceed!',
  };
}
