import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "@radix-ui/react-icons";

export default function AddDevice() {
	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<Card className="flex flex-row items-center justify-start hover:bg-muted cursor-pointer">
						<PlusIcon className="w-6 h-6 ml-6" />
						<div className="flex-1">
							<CardHeader className="pb-2">Add New</CardHeader>
							<CardContent>
								<CardDescription>Click to add a new device.</CardDescription>
							</CardContent>
						</div>
					</Card>
				</DialogTrigger>
				<DialogContent>
					<CardHeader className="pb-2 text-xl font-semibold">
						Add New Device
						<CardDescription>
							Enter the details of the device you want to add.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Label>Device Name</Label>
						<Input placeholder="Enter a name for your device" />
						<br />
						<Label>Description</Label>
						<Textarea placeholder="Enter a description for your device" />
						<Button className="w-full">Add Device</Button>
					</CardContent>
				</DialogContent>
			</Dialog>
		</>
	);
}
