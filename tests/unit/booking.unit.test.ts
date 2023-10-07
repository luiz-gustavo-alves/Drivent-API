import faker from '@faker-js/faker';
import { bookingService } from '@/services';
import { bookingRepository } from '@/repositories';

jest.mock('@/utils/validate-utils', () => {
  return {
    validateUserTicket: () => {
      return 'validateUserTicket mock';
    },
  };
});

describe('booking service unit tests', () => {
  describe('validateRoomBooking function', () => {
    describe('status param is set to "makeBooking" (POST /booking endpoint)', () => {
      it('should throw notFoundError when room is not found', async () => {
        jest.spyOn(bookingRepository, 'getRoomById').mockImplementationOnce(() => {
          return undefined;
        });

        const roomId = faker.datatype.number();
        const userId = faker.datatype.number();

        try {
          await bookingService.makeBooking(roomId, userId);
        } catch (response) {
          expect(bookingRepository.getRoomById).toBeCalled();
          expect(response).toEqual({
            name: 'NotFoundError',
            message: 'Room not found.',
          });
        }
      });

      it('should throw cannotProocedBookingError when user already has booking of requested room', async () => {
        const roomId = faker.datatype.number();
        const userId = faker.datatype.number();
        const date = faker.date.future();

        jest.spyOn(bookingRepository, 'getRoomById').mockImplementationOnce((): any => {
          return {
            id: roomId,
            name: faker.name.firstName(),
            capacity: faker.datatype.number(),
            hotelId: faker.datatype.number(),
            createdAt: date,
            updatedAt: date,
          };
        });

        jest.spyOn(bookingRepository, 'getBookingByRoomAndUserId').mockImplementationOnce((): any => {
          return {
            id: faker.datatype.number(),
            userId,
            roomId,
            createdAt: date,
            updatedAt: date,
          };
        });

        try {
          await bookingService.makeBooking(roomId, userId);
        } catch (response) {
          expect(bookingRepository.getRoomById).toBeCalled();
          expect(bookingRepository.getBookingByRoomAndUserId).toBeCalled();
          expect(response).toEqual({
            name: 'CannotProocedBookingError',
            message: 'Cannot prooced booking request.',
          });
        }
      });

      it('should throw roomCapacityExceedError when requested room has exceed capacity', async () => {
        const roomCapacity = faker.datatype.number();
        const roomId = faker.datatype.number();
        const userId = faker.datatype.number();
        const date = faker.date.future();

        jest.spyOn(bookingRepository, 'getRoomById').mockImplementationOnce((): any => {
          return {
            id: roomId,
            name: faker.name.firstName(),
            capacity: roomCapacity,
            hotelId: faker.datatype.number(),
            createdAt: date,
            updatedAt: date,
          };
        });

        jest.spyOn(bookingRepository, 'getBookingByRoomAndUserId').mockImplementationOnce((): any => {
          return undefined;
        });

        jest.spyOn(bookingRepository, 'getBookingsCounterByRoomId').mockImplementationOnce((): any => {
          return roomCapacity;
        });

        try {
          await bookingService.makeBooking(roomId, userId);
        } catch (response) {
          expect(bookingRepository.getRoomById).toBeCalled();
          expect(bookingRepository.getBookingByRoomAndUserId).toBeCalled();
          expect(bookingRepository.getBookingsCounterByRoomId).toBeCalled();
          expect(response).toEqual({
            name: 'RoomCapacityExceedError',
            message: 'Room maximum capacity exceed!',
          });
        }
      });
    });

    describe('status param is set to "tradeBooking" (PUT /booking/:bookingId endpoint)', () => {
      it('should throw notFoundError when room is not found', async () => {
        jest.spyOn(bookingRepository, 'getRoomById').mockImplementationOnce(() => {
          return undefined;
        });

        const roomId = faker.datatype.number();
        const userId = faker.datatype.number();
        const bookingId = faker.datatype.number();

        try {
          await bookingService.tradeBooking(roomId, userId, bookingId);
        } catch (response) {
          expect(bookingRepository.getRoomById).toBeCalled();
          expect(response).toEqual({
            name: 'NotFoundError',
            message: 'Room not found.',
          });
        }
      });

      it('should throw cannotProocedBookingError when booking is not found', async () => {
        const roomId = faker.datatype.number();
        const userId = faker.datatype.number();
        const bookingId = faker.datatype.number();
        const date = faker.date.future();

        jest.spyOn(bookingRepository, 'getRoomById').mockImplementationOnce((): any => {
          return {
            id: roomId,
            name: faker.name.firstName(),
            capacity: faker.datatype.number(),
            hotelId: faker.datatype.number(),
            createdAt: date,
            updatedAt: date,
          };
        });

        jest.spyOn(bookingRepository, 'getBookingById').mockImplementationOnce((): any => {
          return undefined;
        });

        try {
          await bookingService.tradeBooking(roomId, userId, bookingId);
        } catch (response) {
          expect(bookingRepository.getRoomById).toBeCalled();
          expect(bookingRepository.getBookingById).toBeCalled();
          expect(response).toEqual({
            name: 'CannotProocedBookingError',
            message: 'Cannot prooced booking request.',
          });
        }
      });

      it('should trhow cannotProocedBookingError when requested booking is not from the user', async () => {
        const roomId = faker.datatype.number({ max: 1000 });
        const userId = faker.datatype.number({ max: 1000 });
        const bookingId = faker.datatype.number();
        const date = faker.date.future();

        jest.spyOn(bookingRepository, 'getRoomById').mockImplementationOnce((): any => {
          return {
            id: roomId,
            name: faker.name.firstName(),
            capacity: faker.datatype.number(),
            hotelId: faker.datatype.number(),
            createdAt: date,
            updatedAt: date,
          };
        });

        jest.spyOn(bookingRepository, 'getBookingById').mockImplementationOnce((): any => {
          return {
            id: bookingId,
            userId: faker.datatype.number({ min: 1001 }),
            roomId: faker.datatype.number({ min: 1001 }),
            createdAt: date,
            updatedAt: date,
          };
        });

        try {
          await bookingService.tradeBooking(roomId, userId, bookingId);
        } catch (response) {
          expect(bookingRepository.getRoomById).toBeCalled();
          expect(bookingRepository.getBookingById).toBeCalled();
          expect(response).toEqual({
            name: 'CannotProocedBookingError',
            message: 'Cannot prooced booking request.',
          });
        }
      });

      it('should throw cannotProocedBookingError when requested room is from the same booking room', async () => {
        const roomId = faker.datatype.number();
        const userId = faker.datatype.number();
        const bookingId = faker.datatype.number();
        const date = faker.date.future();

        jest.spyOn(bookingRepository, 'getRoomById').mockImplementationOnce((): any => {
          return {
            id: roomId,
            name: faker.name.firstName(),
            capacity: faker.datatype.number(),
            hotelId: faker.datatype.number(),
            createdAt: date,
            updatedAt: date,
          };
        });

        jest.spyOn(bookingRepository, 'getBookingById').mockImplementationOnce((): any => {
          return {
            id: bookingId,
            userId,
            roomId,
            createdAt: date,
            updatedAt: date,
          };
        });

        try {
          await bookingService.tradeBooking(roomId, userId, bookingId);
        } catch (response) {
          expect(bookingRepository.getRoomById).toBeCalled();
          expect(bookingRepository.getBookingById).toBeCalled();
          expect(response).toEqual({
            name: 'CannotProocedBookingError',
            message: 'Cannot prooced booking request.',
          });
        }
      });

      it('should throw roomCapacityExceedError when requested room has exceed capacity', async () => {
        const roomCapacity = faker.datatype.number();
        const roomId = faker.datatype.number({ max: 1000 });
        const userId = faker.datatype.number();
        const bookingId = faker.datatype.number();
        const date = faker.date.future();

        jest.spyOn(bookingRepository, 'getRoomById').mockImplementationOnce((): any => {
          return {
            id: roomId,
            name: faker.name.firstName(),
            capacity: roomCapacity,
            hotelId: faker.datatype.number(),
            createdAt: date,
            updatedAt: date,
          };
        });

        jest.spyOn(bookingRepository, 'getBookingById').mockImplementationOnce((): any => {
          return {
            id: bookingId,
            userId,
            roomId: faker.datatype.number({ min: 1001 }),
            createdAt: date,
            updatedAt: date,
          };
        });

        jest.spyOn(bookingRepository, 'getBookingsCounterByRoomId').mockImplementationOnce((): any => {
          return roomCapacity;
        });

        try {
          await bookingService.tradeBooking(roomId, userId, bookingId);
        } catch (response) {
          expect(bookingRepository.getRoomById).toBeCalled();
          expect(bookingRepository.getBookingById).toBeCalled();
          expect(bookingRepository.getBookingsCounterByRoomId).toBeCalled();
          expect(response).toEqual({
            name: 'RoomCapacityExceedError',
            message: 'Room maximum capacity exceed!',
          });
        }
      });
    });
  });
});
