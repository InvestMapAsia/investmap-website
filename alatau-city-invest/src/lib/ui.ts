import { PlotStatus } from "@/lib/types";

export const statusColor: Record<PlotStatus, string> = {
  available: "#16A34A",
  reserved: "#F59E0B",
  deal: "#2563EB",
  moderation: "#3B82F6",
  sold: "#6B7280",
  legal_issue: "#DC2626",
};

export const statusLabel: Record<PlotStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  deal: "In deal",
  moderation: "Moderation",
  sold: "Sold",
  legal_issue: "Legal issue",
};

export const legalLabel = {
  a_plus: "A+ Full verification",
  a: "A Verified",
  b: "B Partial",
  c: "C Owner declared",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/map", label: "Map" },
  { href: "/catalog", label: "Catalog" },
  { href: "/projects", label: "Projects" },
  { href: "/pricing", label: "Pricing" },
  { href: "/news", label: "News" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacts", label: "Contacts" },
  { href: "/admin", label: "Admin" },
];

export function currency(value: number, currencyCode: string = "USD") {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)} ${currencyCode}`;
}
