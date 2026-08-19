import {
  Accessibility,
  AlertTriangle,
  BadgeCheck,
  Bug,
  Cloud,
  Copy,
  FileSearch,
  FileText,
  Gauge,
  Globe,
  Image,
  Layers,
  Leaf,
  Link2,
  ListChecks,
  Lock,
  type LucideIcon,
  Network,
  Search,
  Server,
  Shield,
  ShieldAlert,
  Signal,
  Smartphone,
  TrendingUp,
  LayoutDashboard,
  Zap,
} from "lucide-react";
import type { CategoryId } from "./types";

export type ViewKind =
  | { kind: "overview" }
  | { kind: "priorities" }
  | { kind: "findings" }
  | { kind: "pages" }
  | { kind: "category"; category: CategoryId }
  /** Views served by the SiteIQ audit engine; the workspace renders an empty state. */
  | { kind: "engine"; blurb: string };

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  view: ViewKind;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard, view: { kind: "overview" } },
      { id: "priorities", label: "Priorities", icon: ListChecks, view: { kind: "priorities" } },
    ],
  },
  {
    id: "security",
    label: "Security",
    items: [
      { id: "security", label: "Security", icon: Shield, view: { kind: "category", category: "security" } },
      { id: "ssl", label: "SSL / TLS", icon: Lock, view: { kind: "engine", blurb: "Certificate chain, protocol versions and cipher analysis." } },
      { id: "cve", label: "CVE Scanner", icon: Bug, view: { kind: "engine", blurb: "Known vulnerabilities matched against detected software versions." } },
    ],
  },
  {
    id: "performance",
    label: "Performance",
    items: [
      { id: "performance", label: "Performance", icon: Zap, view: { kind: "category", category: "performance" } },
      { id: "pagespeed", label: "PageSpeed", icon: Gauge, view: { kind: "engine", blurb: "Lab and field Core Web Vitals from the PageSpeed pipeline." } },
      { id: "content", label: "Content", icon: FileText, view: { kind: "engine", blurb: "Content weight, text ratio and asset breakdown per page." } },
      { id: "images", label: "Images", icon: Image, view: { kind: "engine", blurb: "Image formats, dimensions and compression opportunities." } },
    ],
  },
  {
    id: "seo",
    label: "SEO",
    items: [
      { id: "seo", label: "SEO Analysis", icon: Search, view: { kind: "category", category: "seo" } },
      { id: "backlinks", label: "Backlinks", icon: Link2, view: { kind: "engine", blurb: "Referring domains, anchor profile and link authority." } },
      { id: "traffic", label: "Traffic", icon: TrendingUp, view: { kind: "engine", blurb: "Estimated organic traffic and keyword visibility." } },
      { id: "accessibility", label: "Accessibility", icon: Accessibility, view: { kind: "category", category: "accessibility" } },
    ],
  },
  {
    id: "privacy",
    label: "Privacy",
    items: [
      { id: "privacy", label: "Privacy & GDPR", icon: BadgeCheck, view: { kind: "category", category: "privacy" } },
    ],
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    items: [
      { id: "infrastructure", label: "Infrastructure", icon: Server, view: { kind: "category", category: "infrastructure" } },
      { id: "technologies", label: "Technologies", icon: Layers, view: { kind: "engine", blurb: "Detected frameworks, CMS, analytics and hosting stack." } },
      { id: "dns", label: "DNS", icon: Globe, view: { kind: "engine", blurb: "DNS records, nameservers and propagation checks." } },
      { id: "domain", label: "Domain", icon: Signal, view: { kind: "engine", blurb: "Registrar, age, expiry and ownership signals." } },
    ],
  },
  {
    id: "site-audit",
    label: "Site Audit",
    items: [
      { id: "pages", label: "Pages", icon: FileSearch, view: { kind: "pages" } },
      { id: "issues", label: "Issues", icon: AlertTriangle, view: { kind: "findings" } },
      { id: "duplicates", label: "Duplicates", icon: Copy, view: { kind: "engine", blurb: "Duplicate titles, descriptions and near-identical pages." } },
      { id: "links", label: "Links", icon: Link2, view: { kind: "engine", blurb: "Internal and external link graph with broken-link detection." } },
      { id: "redirects", label: "Redirects", icon: Network, view: { kind: "engine", blurb: "Redirect chains, loops and status transitions." } },
      { id: "seo-tips", label: "SEO Tips", icon: ListChecks, view: { kind: "engine", blurb: "Prioritised, page-level SEO recommendations." } },
    ],
  },
  {
    id: "advanced",
    label: "Advanced",
    items: [
      { id: "pwa", label: "PWA", icon: Smartphone, view: { kind: "engine", blurb: "Manifest, service worker and installability checks." } },
      { id: "carbon", label: "Carbon", icon: Leaf, view: { kind: "engine", blurb: "Estimated carbon footprint per page view." } },
      { id: "breach", label: "Breach Check", icon: ShieldAlert, view: { kind: "engine", blurb: "Domain exposure across known credential breaches." } },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    items: [
      { id: "findings", label: "All Findings", icon: Cloud, view: { kind: "findings" } },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

export function findNavItem(id: string): NavItem {
  return NAV_ITEMS.find((i) => i.id === id) ?? NAV_ITEMS[0]!;
}
