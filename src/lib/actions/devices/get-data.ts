import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useGetDevice = ({ id }: { id: number | string }) => {
	return useQuery({
		queryKey: ["room", id],
		queryFn: () => {
			return instance.get(`rooms/${id}`);
		},
		enabled: !!id,
	});
};
