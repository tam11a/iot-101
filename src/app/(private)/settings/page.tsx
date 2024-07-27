import { redirect, RedirectType } from "next/navigation";
import Maintainance from "../../maintainance";

export default function Settings() {
	redirect("/devices", RedirectType.replace);
	return <Maintainance />;
}
