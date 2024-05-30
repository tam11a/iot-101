"use client";

import useMqtt from "@/hooks/useMQTT";
import config from "@/lib/config";
import moment from "moment";
import { MqttClient } from "mqtt";
import { useRef, useState } from "react";
import TemperatureChart from "./temp-chart";
import SensorConnect from "./sensor-connect";

export default function Temperature({ device }: { device: any }) {
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
		<div className="p-3">
			<div className="flex flex-row items-center flex-wrap gap-2 p-2">
				{Object.keys(sensors).map((sensor_id: any) => {
					const sensor = sensors[sensor_id];
					return (
						<div
							key={sensor_id}
							className="flex flex-col md:flex-row gap-3 md:items-center w-full"
						>
							<div className="flex flex-col items-start p-2 md:min-w-fit">
								<h3 className="text-3xl font-semibold">
									{sensor.temperature || "--.--"}°C
								</h3>
								<p className="text-lg font-semibold">
									Humidity: {sensor.humidity || "--"}%
								</p>
								<p className="text-muted-foreground">
									Last Updated:{" "}
									{!!sensor.created_at
										? moment(sensor.created_at).calendar()
										: "N/A"}
								</p>
								<SensorConnect
									sensor={sensor}
									sensor_id={sensor_id}
								/>
							</div>
							<TemperatureChart
								sensor={{
									sensor_id,
									...sensor,
								}}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}
