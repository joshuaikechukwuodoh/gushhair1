import { router, protectedProcedure, publicProcedure } from "../trpc";
import { adminRouter } from "./_admin";
import { z } from "zod";
import { db } from "../db";
import { items } from "../db/schema";
import { eq } from "drizzle-orm";

export const appRouter = router({
  admin: adminRouter,

  // CREATE ITEM (UploadThing version)
  createItem: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        image: z.string(), // ✅ URL from UploadThing
      }),
    )
    .mutation(async ({ input }) => {
      return await db
        .insert(items)
        .values({
          name: input.name,
          description: input.description,
          image: input.image,
        })
        .returning();
    }),

  // UPDATE ITEM
  updateItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        image: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await db
        .update(items)
        .set({
          name: input.name,
          description: input.description,
          image: input.image,
        })
        .where(eq(items.id, input.id))
        .returning();
    }),

  // DELETE ITEM
  deleteItem: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await db
        .delete(items)
        .where(eq(items.id, input.id))
        .returning();
    }),

  // GET ALL ITEMS
  getItems: publicProcedure.query(async () => {
    return await db.select().from(items);
  }),

  // GET ITEM BY ID
  getItemById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await db
        .select()
        .from(items)
        .where(eq(items.id, input.id));
    }),
});

export type AppRouter = typeof appRouter;