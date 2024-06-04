"use client";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import useMqtt from "@/hooks/useMQTT";
import config from "@/lib/config";
import moment from "moment";
import { MqttClient } from "mqtt";
import React from "react";

export default function SwitchConnect({
	switchData,
	remote_action = false,
}: {
	switchData: any;
	remote_action: boolean;
}) {
	const [remote, setRemoteActionState] = React.useState<boolean>(remote_action);
	const [status, setRemoteStatus] = React.useState<boolean>(
		switchData?.SwitchState?.[0]?.state || false
	);
	const [lastUpdated, setLastUpdated] = React.useState<any>(
		switchData?.SwitchState?.[0]?.created_at || switchData?.updated_at
	);

	const incomingMessageHandlers = React.useRef([
		{
			topic: `switch/${switchData?.id}/response`,
			handler: ({ packet, payload }: { packet: any; payload: any }) => {
				if (!packet?.retain && payload?.status !== null) {
					setRemoteStatus(payload?.status);
					setLastUpdated(new Date().toISOString());
				}
			},
		},
		{
			topic: `room/${switchData?.room_id}/toggle`,
			handler: ({ packet, payload }: { packet: any; payload: any }) => {
				if (!packet?.retain && payload?.toggle !== null) {
					setRemoteActionState(payload?.toggle);
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

	return (
		<Card className="p-3">
			<p className="text-sm">Switch #{switchData?.id}</p>
			<div className="my-2">
				<Switch
					disabled={!remote}
					checked={status}
					onCheckedChange={async (c: boolean) => {
						if (mqttClientRef.current) {
							mqttClientRef.current.publish(
								`switch/${switchData?.id}/action`,
								JSON.stringify({ action: c })
							);
						}
					}}
				/>
			</div>
			<p className="text-xs text-muted-foreground">
				Updated: {moment(lastUpdated).calendar()}
			</p>
		</Card>
	);
}
