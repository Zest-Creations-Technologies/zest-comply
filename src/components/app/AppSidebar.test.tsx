import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: {
      full_name: "Test User",
      email: "test@example.com",
      avatar_url: null,
      user_plan: { plan: { name: "Pro" } },
    },
  }),
}));

vi.mock("@/lib/api/health", () => ({
  checkApiHealth: vi.fn().mockResolvedValue({ status: "healthy" }),
}));

function renderSidebar() {
  return render(
    <MemoryRouter initialEntries={["/app"]}>
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    </MemoryRouter>,
  );
}

describe("AppSidebar", () => {
  it("renders the shortened enterprise-style nav labels", () => {
    renderSidebar();

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Compliance")).toBeInTheDocument();
    expect(screen.getByText("Governance")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
    expect(screen.getByText("Copilot")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("does not render the old, longer nav labels", () => {
    renderSidebar();

    expect(screen.queryByText("Operations Center")).not.toBeInTheDocument();
    expect(screen.queryByText("Security Operations")).not.toBeInTheDocument();
    expect(screen.queryByText("ZestComply AI")).not.toBeInTheDocument();
    expect(screen.queryByText("Platform")).not.toBeInTheDocument();
  });
});
