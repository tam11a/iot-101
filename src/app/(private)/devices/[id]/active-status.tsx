"use client";

import { Badge } from "@/components/ui/badge";
import useMqtt from "@/hooks/useMQTT";
import config from "@/lib/config";
import moment from "moment";
import { MqttClient } from "mqtt";
import React from "react";

export default function ActiveStatus({
	device_id,
}: {
	device_id: number | string;
}) {
	const [isOnline, setIsOnline] = React.useState<Boolean | null>(null);
	const [pingTime, setPingTime] = React.useState<Date | null>(null);

	const incomingMessageHandlers = React.useRef([
		{
			topic: `ping/${device_id}`,
			handler: ({ packet, payload }: { packet: any; payload: any }) => {
				if (!packet?.retain && payload?.status !== null) {
					setPingTime(new Date());
				}
			},
		},
	]);

	const mqttClientRef = React.useRef<MqttClient | null>(null);
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

	React.useEffect(() => {
		const intervalId = setInterval(() => {
			const now = moment();
			const difference = now.diff(moment(pingTime), "seconds");

			if (difference < 10) {
				setIsOnline(true);
			} else {
				setIsOnline(false);
			}
		}, 1000);

		return () => clearInterval(intervalId); // cleanup the interval on component unmount
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pingTime]);

	return pingTime === null || isOnline === null ? (
		<></>
	) : (
		<>
			{isOnline ? (
				<Badge
					variant="default"
					className="bg-lime-400 hover:bg-lime-500 hover:cursor-pointer"
				>
					Online
				</Badge>
			) : (
				<Badge variant="destructive">Offline</Badge>
			)}
		</>
	);
}
