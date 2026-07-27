/**
 * Unit tests for src/components/ui/button.tsx
 *
 * Tests Button rendering, variants, sizes, and interaction.
 */
// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/render-utils";
import { Button } from "../button";

describe("Button", () => {
  describe("rendering", () => {
    it("renders children text", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
    });

    it("renders with default styles", () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("variants", () => {
    it("renders default variant", () => {
      render(<Button variant="default">Default</Button>);
      expect(screen.getByRole("button", { name: /default/i })).toBeInTheDocument();
    });

    it("renders destructive variant", () => {
      render(<Button variant="destructive">Delete</Button>);
      expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    });

    it("renders outline variant", () => {
      render(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole("button", { name: /outline/i })).toBeInTheDocument();
    });

    it("renders secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole("button", { name: /secondary/i })).toBeInTheDocument();
    });

    it("renders ghost variant", () => {
      render(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole("button", { name: /ghost/i })).toBeInTheDocument();
    });

    it("renders link variant", () => {
      render(<Button variant="link">Link</Button>);
      expect(screen.getByRole("button", { name: /link/i })).toBeInTheDocument();
    });
  });

  describe("sizes", () => {
    it("renders default size", () => {
      render(<Button size="default">Default</Button>);
      expect(screen.getByRole("button", { name: /default/i })).toBeInTheDocument();
    });

    it("renders sm size", () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole("button", { name: /small/i })).toBeInTheDocument();
    });

    it("renders lg size", () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole("button", { name: /large/i })).toBeInTheDocument();
    });

    it("renders icon size", () => {
      render(<Button size="icon">+</Button>);
      expect(screen.getByRole("button", { name: /\+/i })).toBeInTheDocument();
    });
  });

  describe("interaction", () => {
    it("calls onClick when clicked", async () => {
      const onClick = vi.fn();
      const { user } = render(<Button onClick={onClick}>Click</Button>);

      await user.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
      const onClick = vi.fn();
      const { user } = render(
        <Button disabled onClick={onClick}>
          Disabled
        </Button>,
      );

      await user.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });

    it("is disabled when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("is disabled when isLoading is true", () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });
});
