import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Register from "../../pages/Register";

vi.mock("react-router", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("../../api", () => ({
  getStoredTokens: vi.fn(() => ({})),
}));

global.fetch = vi.fn();

describe("Register component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", () => {
    const { container } = render(<Register />);

    expect(container.querySelector('input[type="email"]')).toBeInTheDocument();
    expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    expect(container.querySelector('input[type="password"]')).toBeInTheDocument();
  });

  it("shows validation error when submitting empty form", async () => {
    const { container } = render(<Register />);
    const form = container.querySelector("form");

    fireEvent.submit(form);

    expect(
      await screen.findByText(/email and password are required/i)
    ).toBeInTheDocument();
  });

  

  it("shows server error message when API fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        detail: "Email already exists",
      }),
    });

    const { container } = render(<Register />);

    fireEvent.change(container.querySelector('input[type="email"]'), {
      target: { value: "bad@email.com" },
    });

    fireEvent.change(container.querySelector('input[type="password"]'), {
      target: { value: "123" },
    });

    fireEvent.submit(container.querySelector("form"));

    expect(
      await screen.findByText(/email already exists/i)
    ).toBeInTheDocument();
  });
});
