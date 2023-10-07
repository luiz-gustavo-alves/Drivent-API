import faker from '@faker-js/faker';
import { ticketsRepository, enrollmentRepository } from '@/repositories';
import * as utils from '@/utils/validate-utils';

describe('validate-utils unity tests', () => {
  describe('validateUserTicket function', () => {
    describe('error param is set to "notFound"', () => {
      it('should throw NotFoundError when user has no enrollment', async () => {
        jest.spyOn(enrollmentRepository, 'findEnrollmentByUserId').mockImplementationOnce(() => {
          return undefined;
        });

        const userId = faker.datatype.number();
        try {
          await utils.validateUserTicket(userId, 'notFound');
        } catch (response) {
          expect(enrollmentRepository.findEnrollmentByUserId).toBeCalled();
          expect(response).toEqual({
            name: 'NotFoundError',
            message: 'No enrollments found from user.',
          });
        }
      });

      it('should throw NotFoundError when user has no ticket', async () => {
        jest.spyOn(enrollmentRepository, 'findEnrollmentByUserId').mockImplementationOnce((): any => {
          return {
            id: faker.datatype.number(),
          };
        });

        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce(() => {
          return undefined;
        });

        const userId = faker.datatype.number();
        try {
          await utils.validateUserTicket(userId, 'notFound');
        } catch (response) {
          expect(enrollmentRepository.findEnrollmentByUserId).toBeCalled();
          expect(ticketsRepository.findTicketByEnrollmentId).toBeCalled();
          expect(response).toEqual({
            name: 'NotFoundError',
            message: 'No enrollments found from user.',
          });
        }
      });

      describe('checkHotel param is set to true', () => {
        it('should throw PaymentRequiredError if user ticket is not paid', async () => {
          jest.spyOn(enrollmentRepository, 'findEnrollmentByUserId').mockImplementationOnce((): any => {
            return {
              id: faker.datatype.number(),
            };
          });

          const date = faker.date.future();

          jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
            return {
              id: faker.datatype.number(),
              ticketTypeId: faker.datatype.number(),
              enrollmentId: faker.datatype.number(),
              status: 'RESERVED',
              createdAt: date,
              updatedAt: date,
            };
          });

          jest.spyOn(ticketsRepository, 'findTicketTypeById').mockImplementationOnce((): any => {
            return {
              id: faker.datatype.number(),
              name: faker.name.findName(),
              price: faker.datatype.float(),
              isRemote: false,
              includesHotel: true,
              createdAt: date,
              updatedAt: date,
            };
          });

          const userId = faker.datatype.number();
          try {
            await utils.validateUserTicket(userId, 'notFound');
          } catch (response) {
            expect(enrollmentRepository.findEnrollmentByUserId).toBeCalled();
            expect(ticketsRepository.findTicketByEnrollmentId).toBeCalled();
            expect(ticketsRepository.findTicketTypeById).toBeCalled();
            expect(response).toEqual({
              name: 'PaymentRequiredError',
              message: 'Payment is required to complete requested action',
            });
          }
        });

        it('should throw PaymentRequiredError if user ticket does not includes hotel', async () => {
          jest.spyOn(enrollmentRepository, 'findEnrollmentByUserId').mockImplementationOnce((): any => {
            return {
              id: faker.datatype.number(),
            };
          });

          const date = faker.date.future();

          jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
            return {
              id: faker.datatype.number(),
              ticketTypeId: faker.datatype.number(),
              enrollmentId: faker.datatype.number(),
              status: 'PAID',
              createdAt: date,
              updatedAt: date,
            };
          });

          jest.spyOn(ticketsRepository, 'findTicketTypeById').mockImplementationOnce((): any => {
            return {
              id: faker.datatype.number(),
              name: faker.name.findName(),
              price: faker.datatype.float(),
              isRemote: true,
              includesHotel: false,
              createdAt: date,
              updatedAt: date,
            };
          });

          const userId = faker.datatype.number();
          try {
            await utils.validateUserTicket(userId, 'notFound');
          } catch (response) {
            expect(enrollmentRepository.findEnrollmentByUserId).toBeCalled();
            expect(ticketsRepository.findTicketByEnrollmentId).toBeCalled();
            expect(ticketsRepository.findTicketTypeById).toBeCalled();
            expect(response).toEqual({
              name: 'PaymentRequiredError',
              message: 'Payment is required to complete requested action',
            });
          }
        });
      });
    });
    describe('error param is set to "conflict"', () => {
      it('should throw NotFoundError when user has no enrollment', async () => {
        jest.spyOn(enrollmentRepository, 'findEnrollmentByUserId').mockImplementationOnce(() => {
          return undefined;
        });

        const userId = faker.datatype.number();
        try {
          await utils.validateUserTicket(userId, 'conflict');
        } catch (response) {
          expect(enrollmentRepository.findEnrollmentByUserId).toBeCalled();
          expect(response).toEqual({
            message: 'No enrollments found from user.',
            name: 'NotFoundError',
          });
        }
      });

      it('should throw ConflictError when user has ticket', async () => {
        jest.spyOn(enrollmentRepository, 'findEnrollmentByUserId').mockImplementationOnce((): any => {
          return {
            id: faker.datatype.number(),
          };
        });

        const date = faker.date.future();

        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
          return {
            id: faker.datatype.number(),
            ticketTypeId: faker.datatype.number(),
            enrollmentId: faker.datatype.number(),
            status: 'RESERVED',
            createdAt: date,
            updatedAt: date,
          };
        });

        const userId = faker.datatype.number();
        try {
          await utils.validateUserTicket(userId, 'conflict');
        } catch (response) {
          expect(enrollmentRepository.findEnrollmentByUserId).toBeCalled();
          expect(ticketsRepository.findTicketByEnrollmentId).toBeCalled();
          expect(response).toEqual({
            name: 'ConflictError',
            message: 'There is already a ticket from user enrollment',
          });
        }
      });

      describe('checkHotel param is set to true', () => {
        it('should not call findTicketTypeById function', async () => {
          jest.spyOn(enrollmentRepository, 'findEnrollmentByUserId').mockImplementationOnce((): any => {
            return {
              id: faker.datatype.number(),
            };
          });

          const date = faker.date.future();

          jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
            return undefined;
          });

          jest.spyOn(ticketsRepository, 'findTicketTypeById').mockImplementationOnce((): any => {
            return {
              id: faker.datatype.number(),
              name: faker.name.findName(),
              price: faker.datatype.float(),
              isRemote: false,
              includesHotel: true,
              createdAt: date,
              updatedAt: date,
            };
          });

          const userId = faker.datatype.number();
          try {
            await utils.validateUserTicket(userId, 'conflict', true);
          } catch {
            expect(enrollmentRepository.findEnrollmentByUserId).toBeCalled();
            expect(ticketsRepository.findTicketByEnrollmentId).toBeCalled();
            expect(ticketsRepository.findTicketTypeById).toBeCalledTimes(0);
          }
        });
      });
    });
    describe('error param is set to "forbidden"', () => {
      it('should throw cannotProocedBooking when user has no enrollment', async () => {
        jest.spyOn(enrollmentRepository, 'findEnrollmentByUserId').mockImplementationOnce(() => {
          return undefined;
        });

        const userId = faker.datatype.number();
        try {
          await utils.validateUserTicket(userId, 'forbidden');
        } catch (response) {
          expect(enrollmentRepository.findEnrollmentByUserId).toBeCalled();
          expect(response).toEqual({
            name: 'CannotProocedBookingError',
            message: 'Cannot prooced booking request.',
          });
        }
      });

      it('should throw CannotProocedBooking when user has no ticket', async () => {
        jest.spyOn(enrollmentRepository, 'findEnrollmentByUserId').mockImplementationOnce((): any => {
          return {
            id: faker.datatype.number(),
          };
        });

        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce(() => {
          return undefined;
        });

        const userId = faker.datatype.number();
        try {
          await utils.validateUserTicket(userId, 'forbidden');
        } catch (response) {
          expect(enrollmentRepository.findEnrollmentByUserId).toBeCalled();
          expect(ticketsRepository.findTicketByEnrollmentId).toBeCalled();
          expect(response).toEqual({
            name: 'CannotProocedBookingError',
            message: 'Cannot prooced booking request.',
          });
        }
      });

      describe('checkHotel param is set to true', () => {
        it('should throw CannotProocedBooking if user ticket is not paid', async () => {
          jest.spyOn(enrollmentRepository, 'findEnrollmentByUserId').mockImplementationOnce((): any => {
            return {
              id: faker.datatype.number(),
            };
          });

          const date = faker.date.future();

          jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
            return {
              id: faker.datatype.number(),
              ticketTypeId: faker.datatype.number(),
              enrollmentId: faker.datatype.number(),
              status: 'RESERVED',
              createdAt: date,
              updatedAt: date,
            };
          });

          jest.spyOn(ticketsRepository, 'findTicketTypeById').mockImplementationOnce((): any => {
            return {
              id: faker.datatype.number(),
              name: faker.name.findName(),
              price: faker.datatype.float(),
              isRemote: false,
              includesHotel: true,
              createdAt: date,
              updatedAt: date,
            };
          });

          const userId = faker.datatype.number();
          try {
            await utils.validateUserTicket(userId, 'forbidden');
          } catch (response) {
            expect(enrollmentRepository.findEnrollmentByUserId).toBeCalled();
            expect(ticketsRepository.findTicketByEnrollmentId).toBeCalled();
            expect(ticketsRepository.findTicketTypeById).toBeCalled();
            expect(response).toEqual({
              name: 'CannotProocedBookingError',
              message: 'Cannot prooced booking request.',
            });
          }
        });

        it('should throw CannotProocedBooking if user ticket does not includes hotel', async () => {
          jest.spyOn(enrollmentRepository, 'findEnrollmentByUserId').mockImplementationOnce((): any => {
            return {
              id: faker.datatype.number(),
            };
          });

          const date = faker.date.future();

          jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
            return {
              id: faker.datatype.number(),
              ticketTypeId: faker.datatype.number(),
              enrollmentId: faker.datatype.number(),
              status: 'PAID',
              createdAt: date,
              updatedAt: date,
            };
          });

          jest.spyOn(ticketsRepository, 'findTicketTypeById').mockImplementationOnce((): any => {
            return {
              id: faker.datatype.number(),
              name: faker.name.findName(),
              price: faker.datatype.float(),
              isRemote: true,
              includesHotel: false,
              createdAt: date,
              updatedAt: date,
            };
          });

          const userId = faker.datatype.number();
          try {
            await utils.validateUserTicket(userId, 'forbidden');
          } catch (response) {
            expect(enrollmentRepository.findEnrollmentByUserId).toBeCalled();
            expect(ticketsRepository.findTicketByEnrollmentId).toBeCalled();
            expect(ticketsRepository.findTicketTypeById).toBeCalled();
            expect(response).toEqual({
              name: 'CannotProocedBookingError',
              message: 'Cannot prooced booking request.',
            });
          }
        });
      });
    });
  });
});
