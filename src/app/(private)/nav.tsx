import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Nav() {
	return (
		<Tabs
			defaultValue="dashboard"
			className="max-w-2xl mx-auto px-6 mt-4 bg-background rounded-xl shadow-sm fixed bottom-6 left-0 right-0 z-10"
		>
			<TabsList className="grid w-full grid-cols-3">
				<TabsTrigger value="dashboard">Dashboard</TabsTrigger>
				<TabsTrigger value="devices">Devices</TabsTrigger>
				<TabsTrigger value="settings">Settings</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}
