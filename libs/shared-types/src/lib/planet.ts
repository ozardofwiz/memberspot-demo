import { z } from 'zod';

export const PlanetSchema = z.object({
  name: z.string(),
  terrain: z.string(),
});

export type Planet = z.infer<typeof PlanetSchema>;
