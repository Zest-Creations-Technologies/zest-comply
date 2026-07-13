import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RequestAccessPage from "./RequestAccessPage";

const submitMock = vi.fn().mockResolvedValue({ message: "ok" });

vi.mock("@/lib/api/access-requests", () => ({
  accessRequestsApi: {
    submit: (...args: unknown[]) => submitMock(...args),
  },
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <RequestAccessPage />
    </MemoryRouter>,
  );
}

describe("RequestAccessPage", () => {
  beforeEach(() => {
    submitMock.mockClear();
  });

  it("offers the full employee-band and org-type segmentation in the Company Size dropdown", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("combobox", { name: /company size/i }));

    const expected = [
      "1-10 employees (Startup)",
      "11-50 employees (Small Business)",
      "51-250 employees (Growing Business)",
      "251-1,000 employees (Mid-Market)",
      "1,001-5,000 employees (Enterprise)",
      "5,001-10,000 employees",
      "10,000+ employees",
      "Government Agency",
      "Prime Contractor",
      "Managed Service Provider (MSP/MSSP)",
      "Compliance Consultant / CPA Firm",
    ];

    for (const label of expected) {
      expect(screen.getByRole("option", { name: label })).toBeInTheDocument();
    }
  });

  it("does not render an 'employees' suffix on non-headcount options", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("combobox", { name: /company size/i }));

    expect(screen.queryByText("Government Agency employees")).not.toBeInTheDocument();
  });

  it("submits a trimmed, correctly-shaped payload built from form state", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/company \/ organization name/i), "  Acme Inc  ");
    await user.type(screen.getByLabelText(/first name/i), "  Jane  ");
    await user.type(screen.getByLabelText(/last name/i), "  Doe  ");
    await user.type(screen.getByLabelText(/work email/i), "jane@acme.com");

    await user.click(screen.getByRole("combobox", { name: /company size/i }));
    await user.click(screen.getByRole("option", { name: "Government Agency" }));

    await user.click(screen.getByRole("button", { name: /request access/i }));

    await waitFor(() => expect(submitMock).toHaveBeenCalledTimes(1));

    expect(submitMock).toHaveBeenCalledWith({
      company_name: "Acme Inc",
      contact_first_name: "Jane",
      contact_last_name: "Doe",
      email: "jane@acme.com",
      company_size: "Government Agency",
      message: undefined,
    });
  });

  it("does not submit when required fields are missing", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: /request access/i }));

    expect(submitMock).not.toHaveBeenCalled();
    expect(await screen.findByText(/company name is required/i)).toBeInTheDocument();
  });
});
