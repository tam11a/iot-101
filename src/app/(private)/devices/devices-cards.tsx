"use client";
import { useGetAllDevices } from "@/lib/actions/devices/get-all";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon } from "@radix-ui/react-icons";

export default function DevicesCards() {
	const { data, isLoading } = useGetAllDevices();

	console.log(data);

	return (
		<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 py-5">
			<Card className="flex flex-row items-center justify-start hover:bg-muted cursor-pointer">
				<PlusIcon className="w-6 h-6 ml-6" />
				<div className="flex-1">
					<CardHeader className="pb-2">Add New</CardHeader>
					<CardContent>
						<CardDescription>Click to add a new device.</CardDescription>
					</CardContent>
				</div>
			</Card>
			{isLoading ? (
				<>
					<Skeleton />
					<Skeleton />
					<Skeleton />
				</>
			) : (
				<></>
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
