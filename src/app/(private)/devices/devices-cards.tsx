"use client";
import { useGetAllDevices } from "@/lib/actions/devices/get-all";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AddDevice from "./add-device";

export default function DevicesCards() {
	const { data, isLoading } = useGetAllDevices();

	return (
		<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 py-5">
			{isLoading ? (
				<>
					<Skeleton className="min-h-32" />
					<Skeleton className="min-h-32" />
					<Skeleton className="min-h-32" />
					<Skeleton className="min-h-32" />
					<Skeleton className="min-h-32" />
					<Skeleton className="min-h-32" />
				</>
			) : (
				<>
					<AddDevice />
				</>
			)}
			{data?.data?.map((device: any) => (
				<Card key={device.id}>
					<CardHeader className="inline-block">
						{device.label} <span className="inline">#{device.id}</span>
					</CardHeader>
					<CardContent>
						<CardDescription>{device.description}</CardDescription>
					</CardContent>
				</Card>
			))}
		</section>
	);
}
