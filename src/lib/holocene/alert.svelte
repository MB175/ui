<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  import Icon from '$lib/holocene/icon/icon.svelte';

  import type { IconName } from './icon/paths';

  interface $$Props extends HTMLAttributes<HTMLDivElement> {
    intent: typeof intent;
    title?: string;
    icon?: IconName;
    bold?: boolean;
    'data-testid'?: string;
    hidden?: boolean;
  }

  export let intent: 'warning' | 'caution' | 'error' | 'success' | 'info';
  export let title = '';
  export let icon: IconName = null;
  export let bold = false;
  export let hidden = false;

  let className = '';
  export { className as class };

  $: role = getRole(intent);

  function getRole(
    alertIntent: typeof intent,
  ): HTMLAttributes<HTMLDivElement>['role'] {
    if (alertIntent === 'error') {
      return 'alert';
    }

    if (
      alertIntent === 'success' ||
      alertIntent === 'warning' ||
      alertIntent === 'caution'
    ) {
      return 'status';
    }

    return null;
  }
</script>

<div
  class="alert flex {intent} {className}"
  class:bold
  class:hidden
  {role}
  {...$$restProps}
>
  {#if icon}
    <div>
      <Icon name={icon} />
    </div>
  {/if}
  <div class="ml-1">
    <p class="font-semibold leading-6" class:hidden={!title}>
      {title}
    </p>
    {#if $$slots.default}
      <div class="content">
        <slot />
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  .alert {
    @apply rounded-md border p-5 font-primary text-sm;
  }

  .alert.bold {
    @apply rounded-xl border-2;
  }

  .alert.success {
    @apply border-green-600 bg-green-100 text-green-700;
  }

  .alert.info {
    @apply border-blue-700 bg-blue-50 text-blue-700;
  }

  .alert.error {
    @apply border-red-700 bg-red-100 text-red-700;
  }

  .alert.caution {
    @apply border-orange-700 bg-orange-50 text-orange-700;
  }

  .alert.warning {
    @apply border-yellow-700 bg-yellow-50 text-yellow-700;
  }

  .content :global(> *) {
    @apply font-secondary text-sm font-normal;
  }
</style>
