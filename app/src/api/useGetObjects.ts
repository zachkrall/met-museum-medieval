import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import Papa from "papaparse";

const objectSchema = z.object({
  objectID: z.string(),
  x: z.coerce.number(),
  y: z.coerce.number(),
});

function* parseRow(rows: unknown[]) {
  for (const row of rows) {
    const result = objectSchema.safeParse(row);
    if (result.success) {
      yield result.data;
    }
  }
}

export const useGetObjects = () => {
  return useQuery({
    queryKey: ["objects"],
    queryFn: async function () {
      const response = await fetch("/embedding.csv");
      const csv = await response.text();

      // parse with papaparse and zod

      const schema = z.array(z.any()).transform((data) => {
        return [...parseRow(data)];
      });

      const result = Papa.parse(csv, { header: true });

      const validated = schema.parse(result.data);

      return validated;
    },
  });
};
