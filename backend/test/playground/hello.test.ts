import { handler } from '../../services/spacesTable/create';

const testEvent = {
  body: {
    location: 'dubbo',
  },
};

handler(testEvent as any, {} as any);
