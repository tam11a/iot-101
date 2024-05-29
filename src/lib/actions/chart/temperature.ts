import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useGetTempChart = (params: any) => {
	return useQuery({
		queryKey: ["temp-chart"],
		queryFn: () => {
			return instance.get("/chart/temperature", {
				params,
			});
		},
		refetchOnWindowFocus: false,
	});
};
