import { createRouter } from "@/lib/create-app";
import * as handlers from './tasks.handlers';
import * as routes from './tasks.routes';

// define the routes in a separate file to keep the main file clean
const router = createRouter().openapi(routes.list, handlers.list)

export default router

// This is the index file, it's the entry point for the tasks routes
// Once we have route definition in tasks.routes.ts and route handler in tasks.handlers.ts, we need to smack them together and actually add them to the api
