import { useQuery } from "@tanstack/react-query";

export const useGetObjects = () => {
  return useQuery({
    queryKey: ["objectsEmbedding"],
    queryFn: async function () {
      const response = await fetch("/embedding.json");
      const json = await response.json();

      return json as { objectID: string; x: number; y: number }[];
    },
  });
};
