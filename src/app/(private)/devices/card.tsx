"use client";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import Link from "next/link";
import useMqtt from "@/hooks/useMQTT";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import config from "@/lib/config";
import { useRef, useState } from "react";
import { MqttClient } from "mqtt";
import { LucideFileWarning } from "lucide-react";

export default function DeviceCard({ device }: { device: any }) {
	const [sensors, setSensors] = useState<{
		[sensor_id: number]: {
			temperature: number;
			humidity: number;
			created_at: string;
		};
	}>({
		...(device.sensors || []).reduce((acc: any, sensor: any) => {
			acc[sensor.id] = {
				temperature: sensor.sensor_data?.[0]?.temperature,
				humidity: sensor.sensor_data?.[0]?.humidity,
				created_at: sensor.sensor_data?.[0]?.created_at,
			};
			return acc;
		}, {}),
	});
	const incomingMessageHandlers = useRef([
		...(device.sensors || []).map((sensor: any) => ({
			topic: `sensor/${sensor.id}/live`,
			handler: ({ packet, payload }: { packet: any; payload: any }) => {
				if (!packet?.retain)
					setSensors((prev) => ({
						...prev,
						[sensor.id]: {
							temperature: payload.temp,
							humidity: payload.hum,
							created_at: new Date().toISOString(),
						},
					}));
			},
		})),
	]);

	const mqttClientRef = useRef<MqttClient | null>(null);
	const setMqttClient = (client: MqttClient) => {
		mqttClientRef.current = client;
	};

	useMqtt({
		uri: config.mqttBroker,
		options: {
			clean: true,
			connectTimeout: 4000,
			keepalive: 60,
			reconnectPeriod: 1000,
		},
		topicHandlers: incomingMessageHandlers.current,
		onConnectedHandler: (client) => setMqttClient(client),
	});
	return (
		<>
			<Card className="flex flex-col">
				<CardHeader className="inline-block flex-1">
					{Object.values(sensors)?.length === 0 ? (
						<span className="text-xl text-muted-foreground flex flex-row flex-wrap gap-2">
							<LucideFileWarning size={24} /> No data available
						</span>
					) : null}
					{Object.values(sensors).map((sensor, index) => (
						<div
							key={index}
							className="inline-block"
						>
							<div className="inline-block">
								<span className="text-3xl">{sensor.temperature}</span>{" "}
								<span>°C</span>
							</div>
							<div className="inline-block ml-2 text-sm">
								(<span>{sensor.humidity}%</span>{" "}
								<span className="font-semibold">Humidity</span>)
							</div>
							<p className="text-xs mt-1 text-muted-foreground">
								Last Updated {moment(sensor.created_at).calendar()}
							</p>
						</div>
					))}
				</CardHeader>
				<br />
				<CardHeader className="inline-block py-0 my-0">
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
					<CardDescription>
						{device.description || "No description added"}
					</CardDescription>
				</CardContent>
			</Card>
		</>
	);
}
