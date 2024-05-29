"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { useCreateDevice } from "@/lib/actions/devices/create";
import handleResponse from "@/lib/handle-response";
import { toast } from "sonner";
import { LuLoader2 } from "react-icons/lu";
import { useState } from "react";

export default function AddDevice() {
	const [open, setOpen] = useState(false);
	const form = useForm();

	const { mutateAsync: createDevice, isPending } = useCreateDevice();

	const onSubmit = async (data: any) => {
		const res = await handleResponse(() => createDevice(data), [201]);
		if (res.status) {
			// Generating Toast
			toast("Device added successfully", {
				important: true,
			});
			// Resetting the form
			form.reset();

			// Closing the dialog
			setOpen(false);
		} else {
			// Generating Toast
			toast("Request failed", {
				description: res.message,
				important: true,
				action: {
					label: "Retry",
					onClick: () => onSubmit(data), // Retrying the request
				},
			});
		}
	};

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={(o) => setOpen(o)}
			>
				<DialogTrigger asChild>
					<Card className="flex flex-row items-center justify-start hover:bg-muted cursor-pointer">
						<div className="flex flex-row mx-auto items-center">
							<PlusIcon className="w-8 h-8 mx-auto" />
							<div className="flex-1">
								<CardHeader className="pb-1 font-bold">Add New</CardHeader>
								<CardContent>
									<CardDescription>Click to add a new device.</CardDescription>
								</CardContent>
							</div>
						</div>
					</Card>
				</DialogTrigger>
				<DialogContent>
					<CardHeader className="pb-2 text-xl">
						<span className="font-semibold">Add New Device</span>
						<CardDescription>
							Enter the details of the device you want to add.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="label"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Device Name *</FormLabel>
											<FormControl>
												<Input
													placeholder="Reading Room / Pump etc."
													autoFocus
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Enter a name for your device.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Aa..."
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Enter a description for your device.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									className="w-full"
									type="submit"
									disabled={isPending}
								>
									{isPending ? (
										<>
											<LuLoader2 className="mr-2 h-4 w-4 animate-spin" />
											Adding Device..
										</>
									) : (
										<>Add Device</>
									)}
								</Button>
							</form>
						</Form>
					</CardContent>
				</DialogContent>
			</Dialog>
		</>
	);
}
