import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { appConfig } from "@/config/app";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

// ─── Types ──────────────────────────────────────────────

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

interface FooterProps {
  /** Columnar link sections */
  columns?: FooterColumn[];
  /** Social media links */
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
  /** Custom copyright text */
  copyright?: string;
  /** Brand/logo component */
  brand?: React.ReactNode;
  className?: string;
}

// ─── Default Columns ────────────────────────────────────

const defaultColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

// ─── Component ──────────────────────────────────────────

/**
 * Responsive footer with multi-column links, social icons, and copyright.
 *
 * @example
 * <Footer
 *   socialLinks={{ github: "https://github.com/org", twitter: "https://twitter.com/handle" }}
 * />
 */
export function Footer({
  columns = defaultColumns,
  socialLinks,
  copyright,
  brand,
  className,
}: FooterProps) {
  return (
    <footer className={cn("border-t bg-muted/30", className)}>
      <Container withPadding>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand / Description */}
          <div className="space-y-4">
            {brand ?? (
              <Link href="/" className="text-lg font-bold tracking-tight">
                {appConfig.name}
              </Link>
            )}
            <p className="text-sm text-muted-foreground">
              {appConfig.description}
            </p>
            {socialLinks && (
              <div className="flex items-center gap-3">
                {socialLinks.github && (
                  <Link href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                )}
                {socialLinks.twitter && (
                  <Link href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                    <Twitter className="h-4 w-4" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                )}
                {socialLinks.linkedin && (
                  <Link href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                    <Linkedin className="h-4 w-4" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                )}
                {socialLinks.email && (
                  <Link href={`mailto:${socialLinks.email}`} className="text-muted-foreground transition-colors hover:text-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Email</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Link Columns */}
          {columns.map((column) => (
            <div key={column.title} className="space-y-3">
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          {copyright ?? appConfig.copyright}
        </div>
      </Container>
    </footer>
  );
}
