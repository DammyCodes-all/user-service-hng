import fastify from "fastify";
import dotenv from "dotenv";
import { AuthRoutes } from "./routes/auth-routes";
import { UserRoutes } from "./routes/user-routes";
dotenv.config();
const app = fastify();
const port = process.env.PORT! ? parseInt(process.env.PORT) : 8000;

app.register(AuthRoutes, { prefix: "/auth" });
app.register(UserRoutes, { prefix: "/user" });
app.get("/ping", async (request, reply) => {
  return "pong\n";
});

app.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
