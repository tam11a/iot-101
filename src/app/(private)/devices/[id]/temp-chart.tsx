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

export default function TemperatureChart({ sensor }: { sensor: any }) {
	const { data, isLoading } = useGetTempChart({
		sensor_id: sensor.sensor_id,
		date_lte: moment().endOf("day").toISOString(),
		date_gte: moment().startOf("day").toISOString(),
	});
	return (
		<>
			<ChartRealtime
				sensor={sensor}
				data={data?.data || []}
			/>
		</>
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
						create_time: moment(d.created_at).format("hh:mm:ss a"),
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
					/>
					<Tooltip />
				</LineChart>
			</ResponsiveContainer>
		</>
	);
};
