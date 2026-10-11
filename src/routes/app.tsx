import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/oc/AppShell";

export const Route = createFileRoute("/app")({ component: AppShell });
