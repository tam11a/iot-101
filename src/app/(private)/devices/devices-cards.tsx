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
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import Link from "next/link";

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
						<Link
							className="font-semibold underline"
							href={`/devices/${device.id}`}
						>
							{device.label}
						</Link>{" "}
						<span className="inline">#{device.id}</span>{" "}
						{moment(new Date()).diff(moment(device.created_at), "days") < 2 ? (
							<Badge
								className="ml-2"
								variant={"outline"}
							>
								New
							</Badge>
						) : null}
					</CardHeader>
					<CardContent>
						<CardDescription>{device.description}</CardDescription>
					</CardContent>
				</Card>
			))}
		</section>
	);
}
