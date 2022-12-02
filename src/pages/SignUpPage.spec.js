import SignUpPage from "./SignUpPage.svelte";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { rest } from "msw";


describe("Sign up page", () => {
  describe("Layout", () => {
    it("has Sign Up header", () => {
      render(SignUpPage);
      const header = screen.getByRole("heading", { name: "Sign Up" });
      expect(header).toBeInTheDocument();
    });
    it("has username input", () => {
      render(SignUpPage);
      const input = screen.getByLabelText("Username");
      expect(input).toBeInTheDocument();
    });
    it("has email input", () => {
      render(SignUpPage);
      const input = screen.getByLabelText("E-mail");
      expect(input).toBeInTheDocument();
    });
    it("has password input", () => {
      render(SignUpPage);
      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      render(SignUpPage);
      const input = screen.getByLabelText("Password");
      expect(input.type).toBe("password");
    });
    it("has password type for password repeat input", () => {
      render(SignUpPage);
      const input = screen.getByLabelText("Password Repeat");
      expect(input.type).toBe("password");
    });
    it("has Sign Up button", () => {
      render(SignUpPage);
      const header = screen.getByRole("button", { name: "Sign Up" });
      expect(header).toBeInTheDocument();
    });
    it("has Sign Up button initially disabled", () => {
      render(SignUpPage);
      const button = screen.getByRole("button", { name: "Sign Up" });
      expect(button).toBeDisabled();
    });
  });
  describe("interactions", () => {
    const setup = async () => {
      render(SignUpPage);
      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("E-mail");
      const passwordInput = screen.getByLabelText("Password");
      const passwordRepeatInput = screen.getByLabelText("Password Repeat");
      await userEvent.type(usernameInput, "user1");
      await userEvent.type(emailInput, "user1@mail.com");
      await userEvent.type(passwordInput, "P4ssword");
      await userEvent.type(passwordRepeatInput, "P4ssword");
    };

    it("enables button when password and password repeat match", async () => {
      await setup();
      const button = screen.getByRole("button", { name: "Sign Up" });
      expect(button).toBeEnabled();
    });
    it("sends username, email and password to backend on buttonclick", async () => {
      let requestBody;
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body;
          return res(ctx.status(200));
        })
      );
      server.listen({
        onUnhandledRequest: "warn",
      });
      await setup();
      const button = screen.getByRole("button", { name: "Sign Up" });
      await userEvent.click(button);
      await server.close();

      expect(requestBody).toEqual({
        email: "user1@mail.com",
        password: "P4ssword",
        username: "user1",
      });
    });

    it("disables button when there is an ongoing api call", async () => {
      let counter = 0;
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          counter++;
          return res(ctx.status(200));
        })
      );
      server.listen({
        onUnhandledRequest: "warn",
      });
      await setup();
      const button = screen.getByRole("button", { name: "Sign Up" });
      await userEvent.click(button);
      await userEvent.click(button);

      await server.close();
      expect(counter).toBe(1);
    });

    it("displays spinner while the api request in progress", async () => {
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );

      server.listen();
      await setup();
      const button = screen.getByRole("button", { name: "Sign Up" });

      await userEvent.click(button);

      const spinner = screen.queryByRole("status");
      expect(spinner).toBeInTheDocument();
    });

    it("does not display spinner when there is no api request in progress", async () => {
      await setup();
      // for details on queryByXXX vs getByXXX see https://testing-library.com/docs/dom-testing-library/cheatsheet/
      const spinner = screen.queryByRole("status");
      expect(spinner).not.toBeInTheDocument();
    });

    it("display account activation information after successful sign up request", async () => {
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );
      server.listen();
      await setup();
      const button = screen.getByRole("button", { name: "Sign Up" });
      await userEvent.click(button);
      await server.close();

      // using findBy... as it supports await
      // for more details see https://testing-library.com/docs/dom-testing-library/cheatsheet/
      const text = await screen.findByText(
        "Please check your email to activate your account"
      );
      expect(text).toBeInTheDocument();
    });
    it("does not display account activation message before sign up request", async () => {
      await setup();
      const text = screen.queryByText(
        "Please check your e-mail to activate your account"
      );
      expect(text).not.toBeInTheDocument();
    });
  });
});
