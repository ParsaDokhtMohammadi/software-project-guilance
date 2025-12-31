import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Login from "../../pages/Login";


const navigateMock = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));


vi.mock("../../api", () => ({
  loginUser: vi.fn(),
  fetchCurrentUser: vi.fn(),
  getStoredTokens: vi.fn(() => ({})),
}));

import { loginUser, fetchCurrentUser, getStoredTokens } from "../../api";



describe("Login component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<Login />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /login/i })
    ).toBeInTheDocument();
  });

  it("logs in successfully and navigates to dashboard", async () => {
    loginUser.mockResolvedValueOnce({});
    fetchCurrentUser.mockResolvedValueOnce({});

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(fetchCurrentUser).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("/Dashboard", { replace: true });
  });

  it("shows API error message when login fails", async () => {
    loginUser.mockRejectedValueOnce(new Error("Invalid credentials"));

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "bad@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText(/invalid credentials/i)
    ).toBeInTheDocument();
  });

  it("redirects immediately if token exists", () => {
    getStoredTokens.mockReturnValueOnce({ access: "token" });

    render(<Login />);

    expect(navigateMock).toHaveBeenCalledWith("/Dashboard", { replace: true });
  });
});
