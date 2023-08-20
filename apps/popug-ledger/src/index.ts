import { createServer } from "./server";

const port = 4003;
const server = createServer();

server.listen(port, () => {
  console.log(`api running on ${port}`);
});
