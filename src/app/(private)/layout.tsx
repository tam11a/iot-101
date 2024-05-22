import { ModeToggle } from "@/components/ui/mode-toggle";
import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import TokenValidationChecker from "./token-validation-checker";
import Nav from "./nav";

export default function PrivateLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Check if the user is logged in
	const token = cookies().get("access_token")?.value;
	if (!token) {
		redirect("/", RedirectType.replace);
	}

	return (
		<TokenValidationChecker>
			<main
			// vaul-drawer-wrapper="" // Needed for the drawer to work with scale animation
			>
				{children}

				<Nav />
			</main>
			<div className="fixed bottom-5 right-5 hidden lg:inline">
				<ModeToggle />
			</div>
		</TokenValidationChecker>
	);
}
