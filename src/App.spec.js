import { render, screen } from "@testing-library/svelte"
import App from "./App.svelte"
import { setupDirect } from "@testing-library/user-event/dist/types/setup/setup";

describe("Routing", () => { 

    it.each`
        path         | pageTestId
        ${"/"}       | ${"home-page"}
        ${"/signup"} | ${"signup-page"}
        ${"/login"}  | ${"login-page"}
        ${"/user/1"} | ${"user-page"}
        ${"/user/2"} | ${"user-page"}
    `("displays $pageTestId when path is $path", ({ path, pageTestId }) => {
        window.history.pushState({}, "", path);
        render(App);
        const page = screen.queryByTestId(pageTestId);
        expect(page).toBeInTheDocument();
    });

    it.each`
        path         | pageTestId
        ${"/"}       | ${"signup-page"}
        ${"/"}       | ${"login-page"}
        ${"/"}       | ${"user-page"}
        ${"/signup"} | ${"home-page"}
        ${"/signup"} | ${"login-page"}
        ${"/signup"} | ${"user-page"}
        ${"/login"}  | ${"home-page"}
        ${"/login"}  | ${"signup-page"}
        ${"/login"}  | ${"user-page"}
        ${"/user/1"} | ${"home-page"}
        ${"/user/1"} | ${"signup-page"}
        ${"/user/1"} | ${"login-page"}
    `("does not display $pageTestId when path is $path", ({ path, pageTestId }) => {
        window.history.pushState({}, "", path);
        render(App);
        const page = screen.queryByTestId(pageTestId);
        expect(page).not.toBeInTheDocument();
    });

    it.each`
    path         | queryName
    ${"/"}       | ${"Home"}
    ${"/signup"} | ${"Sign Up"}
    `("has link to $quertName on NavBar", ({ path, queryName}) => {
        setup("/");
        const link = screen.queryByRole("link", { name: queryName });
        expect(link).toBeInTheDocument();
        expect(link.getAttribute("href")).toBe(path);
    });
})