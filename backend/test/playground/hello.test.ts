import { handler } from '../../services/spacesTable/read';

const result = handler({} as any, {} as any).then((res) => {
  const items = JSON.parse(res.body);
  console.log(123);
});
