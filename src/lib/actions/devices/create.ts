import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

const create = (data: any) => {
	return instance.post("/rooms", { ...data });
};

export const useCreateDevice = () => {
	const client = useQueryClient();
	return useMutation({
		mutationFn: create,
		onSuccess: () =>
			client.invalidateQueries({
				queryKey: ["rooms"],
			}),
	});
};
