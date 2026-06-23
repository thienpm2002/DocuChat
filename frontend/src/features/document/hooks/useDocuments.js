import { useQuery } from "@tanstack/react-query";
import { documentApi } from "@/api/documentApi";

export const useDocuments = (params) => {
  return useQuery({
    queryKey: ["documents", JSON.stringify(params)],
    queryFn: () => documentApi.list(params),

    staleTime: 30 * 1000, // 30s (data coi như fresh)
    gcTime: 5 * 60 * 1000, // 5 phút cache (React Query v5)
    refetchOnWindowFocus: false,

    refetchInterval: (query) => {
      const pageData = query.state.data;

      const documents = pageData?.data;

      const hasProcessing = documents?.some(
        (doc) => doc.status === "PROCESSING"
      );

      return hasProcessing ? 3000 : false;
    },
    
  });
};