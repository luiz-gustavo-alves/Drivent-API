import { Payment } from '@prisma/client';
import { prisma } from '@/config';

async function createMakeTicketPayment(params: CreatePaymentParams) {
  const payment = await prisma.payment.create({
    data: params,
  });

  const { ticketId } = params;

  await prisma.ticket.update({
    data: { status: 'PAID' },
    where: { id: ticketId },
  });

  return payment;
}

type CreatePaymentParams = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

export const paymentRepository = {
  createMakeTicketPayment,
};
