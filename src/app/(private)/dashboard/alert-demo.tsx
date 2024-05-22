import { RocketIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertDemo() {
	return (
		<Alert>
			<RocketIcon className="h-4 w-4" />
			<AlertTitle>Heads up!</AlertTitle>
			<AlertDescription>
				You can add devices to monitor and control using the app.
			</AlertDescription>
		</Alert>
	);
}
