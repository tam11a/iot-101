import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import DevicesCards from "./devices-cards";

export default function Devices() {
	return (
		<main className="max-w-7xl mx-auto p-4">
			<Card className="border-none shadow-none">
				<CardHeader className="pb-2">Devices</CardHeader>
				<CardContent>
					<CardDescription>
						Welcome to the devices page! Here you can manage all your devices.
					</CardDescription>
				</CardContent>
			</Card>
			<DevicesCards />
		</main>
	);
}
