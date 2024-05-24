import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useGetAllDevices = () => {
	return useQuery({
		queryKey: ["rooms"],
		queryFn: () => {
			return instance.get("/rooms");
		},
	});
};
