<script>
  import SignUpPage from "./pages/SignUpPage.svelte";
  import LanguageSelector from "./components/LanguageSelector.svelte";
  import HomePage from "./pages/HomePage.svelte";
  import LoginPage from "./pages/LoginPage.svelte";
  import UserPage from "./pages/UserPage.svelte";
  import { _ } from "svelte-i18n";

  let path = window.location.hash;

  window.addEventListener("hashchange", () => {
    path = window.location.hash;
  });
</script>

<div class="container">
  <div>
    <a href="#/" title="Home">Hoaxify</a>
    <a href="#/signup">{$_("signUp")}</a>
  </div>
  {#if path === "#/"}
    <HomePage />
  {:else if path === "#/signup"}
    <SignUpPage />
  {:else if path === "#/login"}
    <LoginPage />
  {:else if path.startsWith("#/user")}
    <UserPage />
  {/if}
  <LanguageSelector />
</div>
