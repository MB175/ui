<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  import { type ComponentProps, createEventDispatcher } from 'svelte';

  import Button from '$lib/holocene/button.svelte';
  import { focusTrap } from '$lib/utilities/focus-trap';

  import IconButton from './icon-button.svelte';

  interface $$Props extends HTMLAttributes<HTMLDialogElement> {
    cancelText: string;
    confirmDisabled?: boolean;
    confirmText: string;
    confirmType?: ComponentProps<Button>['variant'];
    hideConfirm?: boolean;
    hightlightNav?: boolean;
    id: string;
    large?: boolean;
    loading?: boolean;
    'data-testid'?: string;
    open: boolean;
    error?: string;
  }

  export let hideConfirm = false;
  export let confirmText: string;
  export let cancelText: string;
  export let confirmType: ComponentProps<Button>['variant'] = 'primary';
  export let confirmDisabled = false;
  export let large = false;
  export let loading = false;
  export let hightlightNav = false;
  export let id: string;
  export let open: boolean;
  export let error = '';

  let className = '';
  export { className as class };

  let modalElement: HTMLDialogElement;

  $: open, toggleModal();

  export const toggleModal = () => {
    if (open) {
      modalElement?.showModal();
    } else {
      modalElement?.close();
    }
  };

  const dispatch = createEventDispatcher<{
    cancelModal: undefined;
    confirmModal: undefined;
  }>();

  const handleCancel = () => {
    dispatch('cancelModal');
    open = false;
    error = '';
  };

  const confirmModal = () => {
    dispatch('confirmModal');
  };

  const handleClick = (event: MouseEvent) => {
    if (event.target === modalElement) handleCancel();
  };

  $: {
    if (open && modalElement) {
      modalElement.focus();
    }
  }
</script>

<svelte:window on:click={handleClick} />
<dialog
  {id}
  on:close={handleCancel}
  bind:this={modalElement}
  class="body {className}"
  class:large
  class:hightlightNav
  aria-modal="true"
  aria-labelledby="modal-title"
  data-testid={$$props['data-testid']}
  {...$$restProps}
  use:focusTrap={true}
>
  {#if !loading}
    <IconButton
      label={cancelText}
      icon="close"
      class="float-right m-4"
      on:click={handleCancel}
    />
  {/if}
  <div id="modal-title-{id}" class="title">
    <slot name="title" />
  </div>
  <form on:submit|preventDefault={confirmModal} method="dialog">
    <div id="modal-content-{id}" class="content">
      <slot name="content" />
      <p
        class="mt-2 text-sm font-normal text-danger"
        class:hidden={!error}
        role="alert"
      >
        {error}
      </p>
    </div>
    <div class="flex items-center justify-end space-x-2 p-6">
      <Button variant="secondary" disabled={loading} on:click={handleCancel}
        >{cancelText}</Button
      >
      {#if !hideConfirm}
        <Button
          variant={confirmType}
          {loading}
          disabled={confirmDisabled || loading}
          data-testid="confirm-modal-button"
          type="submit">{confirmText}</Button
        >
      {/if}
    </div>
  </form>
</dialog>

<style lang="postcss">
  .body {
    @apply z-50  w-full max-w-lg overflow-y-auto rounded-lg bg-white p-0 text-gray-900 shadow-xl md:h-max;
  }

  .body::backdrop {
    @apply cursor-pointer bg-gray-900 opacity-70;
  }

  .body.hightlightNav::backdrop {
    @apply top-[40px] left-[60px];
  }

  .large {
    @apply lg:w-1/2;
  }

  .title {
    @apply bg-white px-8 pt-8 pb-0 text-2xl;
  }

  .content {
    @apply whitespace-normal p-8;
  }
</style>
