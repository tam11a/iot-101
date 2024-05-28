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
import { useEffect, useRef } from "react";
import { MqttClient } from "mqtt";

export default function DeviceCard({ device }: { device: any }) {
	const incomingMessageHandlers = useRef([
		{
			topic: `sensor/${device.id}/live`,
			handler: (payload: any) => {
				console.log(payload);
			},
		},
	]);

	const mqttClientRef = useRef<MqttClient | null>(null);
	const setMqttClient = (client: MqttClient) => {
		console.log("client", device.id, client);
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
			<Card>
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
		</>
	);
}
