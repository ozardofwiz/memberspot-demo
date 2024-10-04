import { z } from 'zod';
import { PlanetSchema } from './planet';

export const PersonSchema = z.object({
  name: z.string(),
  birth_year: z.string(),
  planet: PlanetSchema.nullable(),
});

export type Person = z.infer<typeof PersonSchema>;
