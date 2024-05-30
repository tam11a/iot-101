"use client";
import {
	Line,
	LineChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
} from "recharts";
import { useGetTempChart } from "@/lib/actions/chart/temperature";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { parseAsIsoDateTime, useQueryState } from "nuqs";

export default function TemperatureChart({ sensor }: { sensor: any }) {
	const [startDate] = useQueryState(
		"startDate",
		parseAsIsoDateTime
			.withDefault(moment().startOf("day").toDate())
			.withOptions({
				clearOnDefault: true,
				history: "replace",
			})
	);
	const [endDate] = useQueryState(
		"endDate",
		parseAsIsoDateTime.withDefault(moment().endOf("day").toDate()).withOptions({
			clearOnDefault: true,
			history: "replace",
		})
	);
	const { data, isLoading } = useGetTempChart({
		sensor_id: sensor.sensor_id,
		date_lte: moment(endDate).endOf("day").toISOString(),
		date_gte: moment(startDate).startOf("day").toISOString(),
	});
	return isLoading ? (
		<Skeleton className="w-full h-[200px]" />
	) : (
		<Card className="h-full w-full pr-6 pt-4">
			<ChartRealtime
				sensor={sensor}
				data={data?.data || []}
			/>
		</Card>
	);
}

const ChartRealtime = ({ sensor, data }: { sensor: any; data: any[] }) => {
	// Add Sensor Realtime Logic Here
	return (
		<>
			<ResponsiveContainer
				width="100%"
				height={200}
			>
				<LineChart
					data={Array.from(data || [], (d: any) => ({
						...d,
						create_time: moment(d.created_at).format("lll"),
					}))}
				>
					<XAxis
						dataKey="create_time"
						stroke="#888888"
						fontSize={12}
						tickLine={false}
						axisLine={false}
						alignmentBaseline="ideographic"
					/>
					<YAxis
						stroke="#888888"
						fontSize={12}
						tickLine={false}
						axisLine={false}
						tickFormatter={(temperature) => `${temperature}°C`}
					/>
					<Line
						type={"monotone"}
						dataKey="temperature"
						stroke="currentColor"
						fill="currentColor"
						className="fill-primary"
						dot={false}
					/>
					<Tooltip
						contentStyle={{
							color: "#000",
							borderRadius: "var(--radius)",
						}}
					/>
				</LineChart>
			</ResponsiveContainer>
		</>
	);
};
