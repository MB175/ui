<script lang="ts">
  import Button from '$lib/holocene/button.svelte';
  import Drawer from '$lib/holocene/drawer.svelte';
  import Shortcut from '$lib/holocene/keyboard-shortcut/shortcut.svelte';
  import { translate } from '$lib/i18n/translate';

  export let open = false;
  export let onOpen: () => void;
  export let onClose: () => void;
</script>

<div class="shortcut-key-button">
  <Button
    size="sm"
    variant="secondary"
    leadingIcon="keyboard"
    on:click={onOpen}
  />
</div>
<Drawer
  {open}
  onClick={onClose}
  title={translate('common.keyboard-shortcuts')}
  closeButtonLabel={translate('common.close-keyboard-shortcuts')}
>
  <div
    class="grid grid-cols-1 gap-8 text-gray-500 dark:text-gray-400 md:grid-cols-2 xl:grid-cols-4"
  >
    <div class="cell">
      {translate('common.next-page')}
      <div class="shortcut">
        <Shortcut
          arrow="right"
          title={translate('common.arrow-key-right')}
        />|<Shortcut title="">L</Shortcut>
      </div>
    </div>
    <div class="cell">
      {translate('common.previous-page')}
      <div class="shortcut">
        <Shortcut
          arrow="left"
          title={translate('common.arrow-key-left')}
        />|<Shortcut title="">H</Shortcut>
      </div>
    </div>
    <div class="cell">
      {translate('common.next-row')}
      <div class="shortcut">
        <Shortcut
          arrow="down"
          title={translate('common.arrow-key-down')}
        />|<Shortcut title="">J</Shortcut>
      </div>
    </div>
    <div class="cell">
      {translate('common.previous-row')}
      <div class="shortcut">
        <Shortcut
          arrow="up"
          title={translate('common.arrow-key-up')}
        />|<Shortcut title="">K</Shortcut>
      </div>
    </div>
  </div>
</Drawer>

<style lang="postcss">
  .shortcut-key-button {
    @apply fixed right-24 bottom-5 z-50 px-2;
  }

  .cell {
    @apply flex items-center justify-center gap-8 text-white;
  }

  .shortcut {
    @apply flex items-center gap-2;
  }
</style>
