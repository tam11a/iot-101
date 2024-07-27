"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
	const pathname = usePathname();
	return (
		<Tabs
			value={pathname?.split("/")[1] ?? "dashboard"}
			className="max-w-2xl mx-auto mt-4 bg-background rounded-xl shadow-sm fixed bottom-6 left-0 right-0 z-10"
		>
			<TabsList className="grid w-full grid-cols-3 border">
				<TabsTrigger
					value="dashboard"
					disabled
				>
					<Link href="/dashboard">Dashboard</Link>
				</TabsTrigger>
				<TabsTrigger value="devices">
					<Link href="/devices">Devices</Link>
				</TabsTrigger>
				<TabsTrigger
					value="settings"
					disabled
				>
					<Link href="/settings">Settings</Link>
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}
