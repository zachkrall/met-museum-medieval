import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const useGetObjectById = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["getObjectById", id],
    queryFn: async () => {
      const response = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
      );

      const json = await response.json();

      return z
        .object({
          title: z.string(),
          primaryImage: z.string(),
          medium: z.string(),
          objectDate: z.string(),
        })
        .parse(json);
    },
    retry: false,
  });
};
