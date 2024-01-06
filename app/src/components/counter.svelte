<script>
  let counter = 0;
</script>

<button on:click={() => counter--}>-</button>
{counter}
<button on:click={() => counter++}>+</button>

