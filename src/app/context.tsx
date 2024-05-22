"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Contexts({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	// ✅ this is stable
	const [query] = useState(() => new QueryClient());

	return <QueryClientProvider client={query}>{children}</QueryClientProvider>;
}
