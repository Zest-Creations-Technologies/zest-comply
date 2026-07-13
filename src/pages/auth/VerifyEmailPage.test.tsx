import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import VerifyEmailPage from "./VerifyEmailPage";

function renderAt(initialPath: string) {
  const router = createMemoryRouter(
    [{ path: "/auth/verify-email", element: <VerifyEmailPage /> }],
    { initialEntries: [initialPath] },
  );
  const utils = render(<RouterProvider router={router} />);
  return { ...utils, router };
}

describe("VerifyEmailPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the sign-in-first fallback when no email is present", () => {
    renderAt("/auth/verify-email");

    expect(
      screen.getByText(/please sign in first to receive a verification code/i),
    ).toBeInTheDocument();
  });

  it("shows the OTP form when an email is present in the query string", () => {
    renderAt("/auth/verify-email?email=test%40example.com");

    expect(screen.getByText(/we sent a verification code to/i)).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  // Regression test for the hooks-order bug: the component used to return
  // early (no email) before declaring several hooks, so navigating from a
  // no-email state to a has-email state without unmounting shifted the
  // hook count between renders and crashed React with "Rendered fewer
  // hooks than expected".
  it("does not throw a hooks-order error when the email appears without unmounting", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { router } = renderAt("/auth/verify-email");
    expect(
      screen.getByText(/please sign in first to receive a verification code/i),
    ).toBeInTheDocument();

    await act(async () => {
      await router.navigate("/auth/verify-email?email=test%40example.com");
    });

    expect(screen.getByText(/we sent a verification code to/i)).toBeInTheDocument();

    const hooksOrderErrors = errorSpy.mock.calls.filter(([message]) =>
      typeof message === "string" &&
      (message.includes("Rendered fewer hooks") || message.includes("Rendered more hooks")),
    );
    expect(hooksOrderErrors).toHaveLength(0);
  });
});
