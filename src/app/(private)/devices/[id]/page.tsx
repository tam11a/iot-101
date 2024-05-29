"use client";
import { useGetDevice } from "@/lib/actions/devices/get-data";
import { LoadingAnimation } from "../../token-validation-checker";
import NotFound from "@/app/not-found";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Temperature from "./temperature";

export default function DevicePage({
	params,
}: {
	params: { id: number | string };
}) {
	const { data, isLoading } = useGetDevice({ id: params.id });
	if (isLoading) return <LoadingAnimation />;
	if (!data?.data) return <NotFound />;
	console.log(data);

	return (
		<main className="max-w-7xl mx-auto p-4 py-8">
			<div className="p-6">
				<p className="text-muted-foreground flex flex-row items-center gap-1">
					<span className="underline font-semibold ">
						Device ID: {data?.data?.id}
					</span>{" "}
					{moment(new Date()).diff(moment(data?.data?.created_at), "days") <
					2 ? (
						<Badge className="ml-2">New</Badge>
					) : null}
				</p>
				<h1 className="text-2xl font-bold">Name: {data?.data?.label}</h1>
				<p className="text-muted-foreground font-semibold">
					Created: {moment(data?.data?.created_at).calendar()}
				</p>
				{data?.data?.updated_at !== data?.data?.created_at && (
					<p className="text-muted-foreground font-semibold">
						Last Updated: {moment(data?.data?.updated_at).calendar()}
					</p>
				)}
				{data?.data?.description && (
					<p className="text-muted-foreground font-semibold">
						Description: {data?.data?.description || "No description added"}
					</p>
				)}
			</div>
			<Separator className="my-2" />
			{!!data?.data?.sensors?.length && <Temperature device={data?.data} />}
		</main>
	);
}
