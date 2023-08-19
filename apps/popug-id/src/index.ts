import { createServer } from "./server";

const server = createServer();

server.listen('4000', () => {
  console.log('on port');
});