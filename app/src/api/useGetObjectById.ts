import { useQuery } from "@tanstack/react-query";

export const useGetObjectById = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["getObjectById", id],
    queryFn: async () => {
      const response = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
      );
      return response.json() as Promise<{
        title: string;
        primaryImage: string;
        medium: string;
        objectDate: string;
      }>;
    },
  });
};
