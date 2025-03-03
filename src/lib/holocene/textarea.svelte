<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  type $$Props = HTMLTextareaAttributes & {
    disabled?: boolean;
    error?: string;
    isValid?: boolean;
    placeholder?: string;
    rows?: number;
    spellcheck?: boolean;
    value: string;
    label: string;
    labelHidden?: boolean;
    id: string;
    required?: boolean;
    description?: string;
    maxLength?: number;
  };

  export let disabled = false;
  export let error = '';
  export let isValid = true;
  export let placeholder = '';
  export let rows = 5;
  export let spellcheck: boolean = null;
  export let value: string;
  export let label: string;
  export let labelHidden = false;
  export let id: string;
  export let required = false;
  export let description = '';
  export let maxLength = 0;

  let className = '';
  export { className as class };
</script>

<div class={className}>
  <label class:required class:sr-only={labelHidden} for={id}>{label}</label>
  {#if description}
    <p class="text-sm">{description}</p>
  {/if}
  <div class="relative">
    <textarea
      class="min-h-fit w-full rounded border border-gray-900 py-2 px-3 font-mono text-sm"
      class:error={!isValid}
      {id}
      bind:value
      {disabled}
      {placeholder}
      {rows}
      {spellcheck}
      on:input
      on:change
      on:focus
      on:blur
      on:keydown|stopPropagation
      maxlength={maxLength > 0 ? maxLength : undefined}
    />
    {#if maxLength && !disabled}
      <span class="count">
        <span
          class="text-blue-700"
          class:warn={maxLength - value?.length <= 5}
          class:error={maxLength === value?.length}>{value?.length ?? 0}</span
        >&nbsp;/&nbsp;{maxLength}
      </span>
    {/if}
  </div>
  <div
    class="error-msg"
    class:min-width={maxLength}
    aria-live={isValid ? 'off' : 'assertive'}
  >
    {#if !isValid}
      {#if error}
        <p>{error}</p>
      {/if}
      <slot name="error" />
    {/if}
  </div>
</div>

<style lang="postcss">
  label {
    @apply mb-10 font-secondary text-sm font-medium;
  }

  label.required {
    @apply after:content-["*"];
  }

  .error {
    @apply border-danger;
  }

  .error-msg {
    @apply min-h-[1.25rem] break-words border-danger font-primary text-sm font-normal text-danger;
  }

  .error-msg.min-width {
    @apply w-[calc(100%-6rem)];
  }

  .count {
    @apply invisible absolute -bottom-5 right-0 font-secondary text-sm font-medium text-primary;
  }

  .count > .warn {
    @apply text-orange-600;
  }

  .count > .error {
    @apply text-red-700;
  }

  textarea:focus + .count {
    @apply visible;
  }
</style>
