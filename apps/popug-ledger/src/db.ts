import { DataSource } from "typeorm";

export const db = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
    entities: ["src/models/*.ts"],
    logging: true,
    synchronize: true,
})

db
  .initialize()
  .then(() => {
      console.log("Data Source has been initialized!")
  })
  .catch((err) => {
      console.error("Error during Data Source initialization:", err)
  })