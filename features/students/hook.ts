import { useQuery } from "@tanstack/react-query";
import { getMotivationOptionsAction } from "./actions";

const motivationOptionsKey = {
  all: ["motivationOptions"] as const,
};

export function useGetMotivationOptionsList() {
  return useQuery({
    queryKey: motivationOptionsKey.all,
    queryFn: async () => {
      const result = await getMotivationOptionsAction();

      if (result.success === false) {
        throw new Error(
          result.error.global ??
            "une erreur est survenue lors du chargement des données",
        );
      }

      return result.data;
    },
  });
}
