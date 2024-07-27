"use client";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import useMqtt from "@/hooks/useMQTT";
import config from "@/lib/config";
import moment from "moment";
import { MqttClient } from "mqtt";
import React from "react";
import { useLottie } from "lottie-react";
import pump from "./pump.json";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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

	const { View, play, setDirection } = useLottie(
		{
			animationData: pump,
			loop: false,
			autoplay: false,
		},
		{
			height: 100,
		}
	);

	React.useEffect(() => {
		if (status) {
			play();
			setDirection(1);
		} else {
			setDirection(-1);
			play();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status, remote]);

	return (
		<div className="relative">
			<Card className="p-3 rounded-b-none">
				<p className="text-sm text-center font-bold">
					Aerator No #{switchData?.id}
				</p>
			</Card>
			<Card
				className={cn(
					"rounded-none border-t-0 p-3 flex flex-row relative  min-h-[100px]",
					status ? "bg-lime-50" : "bg-red-50"
				)}
			>
				<div className="flex-1 w-full">
					<div className="my-2">
						{/* <Switch
							disabled={!remote}
							checked={status}
							onCheckedChange={async (c: boolean) => {
								// if (mqttClientRef.current) {
								// 	mqttClientRef.current.publish(
								// 		`switch/${switchData?.id}/action`,
								// 		JSON.stringify({ action: c })
								// 	);
								// }
								setRemoteStatus(c);
							}}
						/> */}
					</div>
				</div>
				<div className="absolute bottom-0 right-0">{View}</div>
			</Card>
			<Card className={cn("rounded-none border-y-0", "p-3")}>
				<p className="text-xs text-muted-foreground">
					Updated: {moment(lastUpdated).calendar()}
				</p>
			</Card>
			<Card
				className={cn(
					"rounded-t-none p-3 flex flex-row items-center justify-center gap-2"
				)}
			>
				{remote ? (
					<>
						<Button
							className="flex-1 bg-lime-600 hover:bg-lime-700 disabled:bg-lime-300"
							disabled={status || !remote}
							onClick={async () => {
								if (mqttClientRef.current) {
									mqttClientRef.current.publish(
										`switch/${switchData?.id}/action`,
										JSON.stringify({ action: true })
									);
								}
								// setRemoteStatus(true);
							}}
						>
							Start
						</Button>
						<Button
							className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-200"
							disabled={!status || !remote}
							onClick={async () => {
								if (mqttClientRef.current) {
									mqttClientRef.current.publish(
										`switch/${switchData?.id}/action`,
										JSON.stringify({ action: false })
									);
								}
								// setRemoteStatus(false);
							}}
						>
							Stop
						</Button>
					</>
				) : (
					<Badge className="bg-red-500">Control Disabled</Badge>
				)}
			</Card>
		</div>
	);
}
