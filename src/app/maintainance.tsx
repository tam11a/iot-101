"use client";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Maintainance() {
	return (
		<div className="min-h-screen w-full flex flex-col items-center justify-center gap-3 max-w-xs text-center mx-auto">
			<h1 className="text-7xl font-bold mb-6">503</h1>
			<CardTitle>Down for Maintainance</CardTitle>
			<CardDescription>
				The page you are looking for is down for maintainance.
			</CardDescription>
			<Link href="/">
				<Button>Return Home</Button>
			</Link>
		</div>
	);
}
