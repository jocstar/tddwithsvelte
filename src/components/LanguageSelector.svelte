<script>
    import { locale } from "svelte-i18n";
</script>

<img
    src="https://flagcdn.com/w20/tr.png"
    title="Türkçe"
    alt="Turkish Flag"
    on:click={() => locale.set("tr")}
/>
<img
    src="https://flagcdn.com/w20/gb.png"
    title="English"
    alt="UK Flag"
    on:click={() => locale.set("en")}
/>

<style>
    img {
        cursor: pointer;
    }
</style>
