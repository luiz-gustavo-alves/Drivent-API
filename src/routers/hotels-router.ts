import { Router } from 'express';
import { authenticateToken } from '@/middlewares';

import { getAllHotels, getHotelRooms } from '@/controllers';

const hotelRouter = Router();

// eslint-disable-next-line prettier/prettier
hotelRouter
  .all('/*', authenticateToken)
  .get('/', getAllHotels)
  .get('/:hotelId', getHotelRooms)

export { hotelRouter };
