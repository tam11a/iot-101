"use client";

// Form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// UI
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Icon
import { LuLoader2 } from "react-icons/lu";

// Actions

// Utils
import handleResponse from "@/lib/handle-response";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth.service";
import { useLogin } from "@/lib/actions/auth/sign-in";

// Form Schema
const formSchema = z.object({
	email: z
		.string()
		.min(6, {
			message: "Email must be at least 6 characters.",
		})
		.max(155, {
			message: "Email must be at most 155 characters.",
		}),
	password: z.string().min(6, {
		message: "Password must be at least 6 characters.",
	}),
});

export function SignForm() {
	// Router Hook
	const router = useRouter();

	// Login Hook
	const { mutateAsync: login, isPending } = useLogin();

	// Form Hook
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Clearing errors
		form.clearErrors();

		// Making the request
		const res = await handleResponse(() => login(values));

		if (res.status) {
			// Setting cookies

			authService.setToken(res.data.token);

			// Generating Toast
			toast("Logged in successfully!", {
				description: `Welcome back, ${res.data.user.first_name}`,
				important: true,
			});

			// Redirect to dashboard
			router.refresh();
		} else {
			// Setting errors
			form.setError("email", {
				type: "validate",
				message: "",
			});
			form.setError("password", {
				type: "validate",
				message: res.message,
			});

			// Generating Toast
			toast("Request failed", {
				description: res.message,
				important: true,
				action: {
					label: "Retry",
					onClick: () => onSubmit(values), // Retrying the request
				},
			});
		}
	}

	return (
		<Form {...form}>
			<Card className="mx-2">
				<CardHeader>
					<CardTitle>Welcome</CardTitle>
					<CardDescription>
						Sign in with your organization credentials.
					</CardDescription>
				</CardHeader>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="space-y-3">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder="example@email.com"
											autoComplete="email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="********"
											autoComplete="current-password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter>
						<Button
							type="submit"
							className="w-full"
							size={"lg"}
							disabled={isPending}
						>
							{isPending ? (
								<>
									<LuLoader2 className="mr-2 h-4 w-4 animate-spin" />
									Signing in..
								</>
							) : (
								<>Sign in</>
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</Form>
	);
}
