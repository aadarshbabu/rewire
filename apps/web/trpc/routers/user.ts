import { z } from "zod";
import { createTRPCRouter, baseProcedure } from "../init";

export const userRouter = createTRPCRouter({
  list: baseProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return users;
  }),

  byId: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
      });
      return user;
    }),

  create: baseProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.create({
        data: input,
      });
      return user;
    }),
});
