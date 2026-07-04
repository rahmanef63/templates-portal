import { httpRouter } from "convex/server";
import { auth } from "./auth";
// @convex-dev/auth mounts its sign-in / callback routes here.
const http = httpRouter();
auth.addHttpRoutes(http);
export default http;
