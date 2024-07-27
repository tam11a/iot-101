"use client";
import { useGetDevice } from "@/lib/actions/devices/get-data";
import { LoadingAnimation } from "../../token-validation-checker";
import NotFound from "@/app/not-found";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Temperature from "./temperature";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useQueryState, parseAsIsoDateTime } from "nuqs";
import SwitchConnect from "./switch-connect";
import { Button } from "@/components/ui/button";
import ActiveStatus from "./active-status";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export default function DevicePage({
	params,
}: {
	params: { id: number | string };
}) {
	const { data, isLoading } = useGetDevice({ id: params.id });
	const [startDate, setStartDate] = useQueryState(
		"startDate",
		parseAsIsoDateTime
			.withDefault(moment().startOf("day").toDate())
			.withOptions({
				clearOnDefault: true,
				history: "replace",
			})
	);
	const [endDate, setEndDate] = useQueryState(
		"endDate",
		parseAsIsoDateTime.withDefault(moment().endOf("day").toDate()).withOptions({
			clearOnDefault: true,
			history: "replace",
		})
	);
	if (isLoading) return <LoadingAnimation />;
	if (!data?.data) return <NotFound />;

	return (
		<main className="max-w-7xl mx-auto p-4 py-8">
			<Card className="p-10 w-full flex flex-row items-start justify-between">
				<div>
					<p className="text-muted-foreground flex flex-row items-center gap-1">
						<span className="underline font-semibold ">
							Device ID: {data?.data?.id}
						</span>{" "}
						{moment(new Date()).diff(moment(data?.data?.created_at), "days") <
						2 ? (
							<Badge className="ml-2">New</Badge>
						) : null}
						{!data?.data?.remote_action ? (
							<Badge
								className="ml-2"
								variant={"destructive"}
							>
								Manual Control
							</Badge>
						) : null}
					</p>
					<h1 className="text-2xl font-bold flex flex-row items-center gap-2">
						Name: {data?.data?.label}
						<ActiveStatus device_id={data?.data?.id} />
					</h1>
					{data?.data?.description && (
						<p className="text-muted-foreground font-semibold">
							Description: {data?.data?.description || "No description added"}
						</p>
					)}
					<p className="text-muted-foreground font-semibold">
						Created: {moment(data?.data?.created_at).calendar()}
					</p>
				</div>
				<div>
					<p className="text-muted-foreground font-semibold">
						Total Switches: {data?.data?.switches?.length}
					</p>
					<p className="text-muted-foreground font-semibold">
						Total Sensors: {data?.data?.sensors?.length}
					</p>
				</div>
			</Card>
			{data?.data?.switches?.length > 0 && (
				<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 my-3 gap-3">
					{data?.data?.switches?.map((sw: any) => {
						return (
							<SwitchConnect
								key={sw.id}
								switchData={sw}
								remote_action={data?.data?.remote_action}
							/>
						);
					})}
				</div>
			)}
			<div className="flex flex-row items-center justify-between py-3">
				<div />
				<Popover>
					<PopoverTrigger>
						<Button
							size={"sm"}
							variant={"secondary"}
						>
							Filter Date
							{/* {moment(startDate).calendar()} - {moment(endDate).calendar()} */}
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className="w-auto p-0"
						align="start"
					>
						<Calendar
							mode="range"
							selected={{
								from: startDate,
								to: endDate,
							}}
							onSelect={(range: any) => {
								setStartDate(moment(range?.from).startOf("day").toDate());
								setEndDate(moment(range?.to).endOf("day").toDate());
							}}
						/>
					</PopoverContent>
				</Popover>
			</div>
			{!!data?.data?.sensors?.length && <Temperature device={data?.data} />}
		</main>
	);
}
