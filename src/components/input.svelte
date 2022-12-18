<script>
    export let label = "",
        id = "",
        help = "",
        type = "text";
</script>

<div class="form-group">
    <label for={id}>{label}</label>
    <!--  below bind:value is shorthand for bind:value={value} when x is same for x={x} -->
    <!--  class:is-invalid={help} means if help, add :xxxx to the classnames list- -->
    <input {id} class="form-control" class:is-invalid={help} {type} on:input />
    {#if help}
        <span class="invalid-feedback" role="alert">{help}</span>
    {/if}
</div>
