<script lang="ts">
  import { getContext } from 'svelte';

  import NumberInput from '$lib/holocene/input/number-input.svelte';
  import { translate } from '$lib/i18n/translate';

  import ConditionalMenu from './conditional-menu.svelte';
  import { FILTER_CONTEXT, type FilterContext } from './index.svelte';

  const { filter, focusedElementId, handleSubmit } =
    getContext<FilterContext>(FILTER_CONTEXT);
  const min = 0;
  let value = $filter.value ? Number($filter.value) : null;

  const handleKeydown = (e: KeyboardEvent) => {
    $focusedElementId = '';
    if (e.key === 'Enter' && value !== null && value >= min) {
      $filter.value = String(value);
      e.preventDefault();
      handleSubmit();
    }
  };
</script>

<div class="flex items-center">
  <ConditionalMenu inputId="number-filter-search" noBorderLeft noBorderRight />
  <NumberInput
    label={translate('common.number-input-placeholder')}
    labelHidden
    id="number-filter-search"
    icon="search"
    placeholder={translate('common.number-input-placeholder')}
    bind:value
    {min}
    on:keydown={handleKeydown}
    unroundLeft
    search
    class="-mr-2"
  />
</div>
