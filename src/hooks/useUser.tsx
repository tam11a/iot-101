"use client";

import { useCurrentUser } from "@/lib/actions/auth/current_user";

const useUser = () => {
	const { data, isLoading, isError, error } = useCurrentUser();

	return {
		user: data,
		access: data,
		isLoading: isLoading,
		isError: isError,
		error: error,
	};
};

export default useUser;
