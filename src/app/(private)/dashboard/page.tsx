import { redirect, RedirectType } from "next/navigation";
import { AlertDemo } from "./alert-demo";

export default function Dashboard() {
	redirect("/devices", RedirectType.replace);

	return (
		<main className="max-w-7xl mx-auto p-4">
			<AlertDemo />
		</main>
	);
}
