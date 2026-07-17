import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ConnectionsAdminPage from "./ConnectionsAdminPage";

const getMock = vi.fn();
const updateMock = vi.fn();
const checkNowMock = vi.fn();

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return {
    ...actual,
    connectionsApi: {
      get: (...args: unknown[]) => getMock(...args),
      update: (...args: unknown[]) => updateMock(...args),
      checkNow: (...args: unknown[]) => checkNowMock(...args),
      remove: vi.fn(),
    },
  };
});

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ConnectionsAdminPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const emptyConnection = {
  organization_id: "org-1",
  provider: "okta",
  domain: null,
  enabled: false,
  has_credentials: false,
  last_check_status: null,
  last_check_at: null,
  last_check_error: null,
};

describe("ConnectionsAdminPage", () => {
  beforeEach(() => {
    getMock.mockReset();
    updateMock.mockReset();
    checkNowMock.mockReset();
  });

  it("renders the not-connected empty state", async () => {
    getMock.mockResolvedValue(emptyConnection);
    renderPage();

    expect(await screen.findByText(/not connected yet/i)).toBeInTheDocument();
    expect(screen.getByText(/not checked yet/i)).toBeInTheDocument();
  });

  it("disables Check now until a connection is configured", async () => {
    getMock.mockResolvedValue(emptyConnection);
    renderPage();

    await screen.findByText(/not connected yet/i);
    expect(screen.getByRole("button", { name: /check now/i })).toBeDisabled();
  });

  it("submits domain and token on save", async () => {
    getMock.mockResolvedValue(emptyConnection);
    updateMock.mockResolvedValue({ ...emptyConnection, domain: "acme.okta.com", enabled: true, has_credentials: true });
    const user = userEvent.setup();
    renderPage();

    await screen.findByText(/not connected yet/i);
    await user.type(screen.getByLabelText(/okta domain/i), "acme.okta.com");
    await user.type(screen.getByLabelText(/api token/i), "secret-token");
    await user.click(screen.getByRole("button", { name: /save connection/i }));

    await waitFor(() => expect(updateMock).toHaveBeenCalledTimes(1));
    expect(updateMock).toHaveBeenCalledWith({
      provider: "okta",
      domain: "acme.okta.com",
      api_token: "secret-token",
      enabled: false,
    });
  });

  it("does not resend the token on a second save once configured", async () => {
    const configured = { ...emptyConnection, domain: "acme.okta.com", enabled: true, has_credentials: true };
    getMock.mockResolvedValue(configured);
    updateMock.mockResolvedValue({ ...configured, enabled: false });
    const user = userEvent.setup();
    renderPage();

    await screen.findByText(/a connection is configured/i);
    await user.click(screen.getByLabelText(/enabled/i));
    await user.click(screen.getByRole("button", { name: /save connection/i }));

    await waitFor(() => expect(updateMock).toHaveBeenCalledTimes(1));
    expect(updateMock).toHaveBeenCalledWith({
      provider: "okta",
      domain: "acme.okta.com",
      api_token: undefined,
      enabled: false,
    });
  });
});
