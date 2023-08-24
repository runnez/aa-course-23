import { attachConsumers } from "./consumer";
import { createServer } from "./server";

const server = createServer();

server.listen(4001, () => {
  console.log('popug-jira is on port 4001');
});

attachConsumers().catch(console.error)