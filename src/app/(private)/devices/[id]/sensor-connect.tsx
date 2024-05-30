"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import config from "@/lib/config";

export default function SensorConnect({
	sensor,
	sensor_id,
}: {
	sensor: any;
	sensor_id: number;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={"link"}>Connect</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<span className="font-semibold">Connect Sensor</span>
					<span className="text-sm">
						Connect your sensor to the device by following the instructions
						below.
					</span>
				</DialogHeader>
				<Separator />
				<DialogDescription>
					<Tabs
						defaultValue="postman"
						className="w-[400px]"
					>
						<TabsList>
							<TabsTrigger value="postman">Postman</TabsTrigger>
							<TabsTrigger value="python">Python</TabsTrigger>
						</TabsList>

						<TabsContent
							value="postman"
							className="space-y-2"
						>
							<p>1. Open Postman</p>
							<p>2. Create a new mqtt request</p>
							<p>
								3. Set the method to <code>V5</code>
							</p>
							<p>
								4. Copy the following URL: <code>{config.mqttBase}</code>
							</p>
							<p>
								5. Set the topic to <code>sensor/{sensor_id}/live</code>
							</p>
						</TabsContent>
						<TabsContent value="python"></TabsContent>
					</Tabs>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
}
