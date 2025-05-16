// export a hono api instance has a specific documented route
// create a stand along hono api instance to be mounted on top of this app

import { createRouter } from "@/lib/create-app";
import { createRoute, z } from "@hono/zod-openapi";
// * means “grab every named export from the module.” 
// as HttpStatusCodes means: bundle them all into a single object called HttpStatusCodes.
import * as HttpStatusCodes from "stoker/http-status-codes";
import jsonContent from "stoker/openapi/helpers/json-content";

// .openapi(...) takes two arguments:
// Route metadata (for generating docs and validating),
// Handler (the function that actually runs on an incoming request).
const router = createRouter()
  .openapi(
    // route definition
    createRoute({
      tags: ['Index'], // tags are used to group routes in the scalar UI
      method: 'get',
      path: '/',
      responses: {
        // 200 is the key of the response
        // at runtime your responses object is effectively { 200: { /* JSON schema & description */ } }
        // jsonContent takes Schema and description
        [HttpStatusCodes.OK]: jsonContent(
          z.object({
            message: z.string(),
          }),
          'Task API Index'
          )
      },
    }),

    // handler: implement the logic
    (c) => {
      return c.json({
        message: "task api"
    }, HttpStatusCodes.OK)
    }
  )

export default router

// Original router creation
// const router = createRouter()
//   .openapi(
//     createRoute({
//       tags: ['Index'],
//       method: 'get',
//       path: '/',
//       responses: {
//         200: {
//           content: {
//             'application/json': {
//               schema: z.object({
//                 message: z.string(),
//               }), 
//             },
//           },
//           description: 'Task API Index'
//         }
//       },
//     }),

//     (c) => {
//       return c.json({
//         message: "task api"
//     }, 200)
//     }
//   )

// Helper function from stoker
// import type { ZodSchema } from "./types.ts";

// const jsonContent = <
//   T extends ZodSchema,
// >(schema: T,
//   description: string,
// ) => {
//   return {
//     content: {
//       "application/json": {
//         schema,
//       },
//     },
//     description,
//   };
// };

// export default jsonContent;