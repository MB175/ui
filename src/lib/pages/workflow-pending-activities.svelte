<script lang="ts">
  import Badge from '$lib/holocene/badge.svelte';
  import CodeBlock from '$lib/holocene/code-block.svelte';
  import EmptyState from '$lib/holocene/empty-state.svelte';
  import Icon from '$lib/holocene/icon/icon.svelte';
  import Link from '$lib/holocene/link.svelte';
  import TableHeaderRow from '$lib/holocene/table/table-header-row.svelte';
  import TableRow from '$lib/holocene/table/table-row.svelte';
  import Table from '$lib/holocene/table/table.svelte';
  import { translate } from '$lib/i18n/translate';
  import { relativeTime, timeFormat } from '$lib/stores/time-format';
  import { workflowRun } from '$lib/stores/workflow-run';
  import { formatDate } from '$lib/utilities/format-date';
  import {
    formatAttemptsLeft,
    formatMaximumAttempts,
    formatRetryExpiration,
  } from '$lib/utilities/format-event-attributes';
  import { formatDuration, getDuration } from '$lib/utilities/format-time';
  import { stringifyWithBigInt } from '$lib/utilities/parse-with-big-int';
  import { toTimeDifference } from '$lib/utilities/to-time-difference';

  $: pendingActivities = $workflowRun.workflow?.pendingActivities;
</script>

{#if pendingActivities.length}
  <Table class="mb-6 w-full min-w-[600px] table-fixed">
    <caption class="sr-only" slot="caption"
      >{translate('workflows.pending-activities-tab')}</caption
    >
    <TableHeaderRow slot="headers">
      <th class="w-44">{translate('workflows.activity-id')}</th>
      <th>{translate('workflows.details')}</th>
    </TableHeaderRow>
    {#each pendingActivities as { id, activityId, ...details } (id)}
      {@const failed = details.attempt > 1}
      <TableRow>
        <td class="w-44 items-start break-all py-5 pl-5 pr-2 align-top">
          <div class="pt-1">
            <Link href="#{id}">{activityId}</Link>
          </div>
        </td>
        <td class="py-4 px-5">
          <ul>
            <li class="event-table-row">
              <h4 class="font-semibold">
                {translate('workflows.activity-type')}
              </h4>
              <Badge type={failed ? 'error' : 'default'}>
                {details.activityType}
              </Badge>
            </li>
            <li class="event-table-row">
              <h4>{translate('workflows.attempt')}</h4>
              <Badge type={failed ? 'error' : 'default'}>
                {#if failed}
                  <Icon class="mr-1" name="retry" />
                {/if}
                {details.attempt}
              </Badge>
            </li>
            {#if failed}
              <li class="event-table-row">
                <h4>{translate('workflows.attempts-left')}</h4>
                <Badge type="error">
                  {formatAttemptsLeft(details.maximumAttempts, details.attempt)}
                </Badge>
              </li>
              {#if details.scheduledTime}
                <li class="event-table-row">
                  <h4>{translate('workflows.next-retry')}</h4>
                  <Badge type="error">
                    {toTimeDifference({
                      date: details.scheduledTime,
                      negativeDefault: translate('workflows.no-retry'),
                    })}
                  </Badge>
                </li>
              {/if}
            {/if}
            <li class="event-table-row">
              <h4>{translate('workflows.maximum-attempts')}</h4>
              <Badge>{formatMaximumAttempts(details.maximumAttempts)}</Badge>
            </li>
            {#if failed}
              {#if details.heartbeatDetails}
                <li class="event-table-row">
                  <h4>{translate('workflows.heartbeat-details')}</h4>
                  <CodeBlock
                    slot="value"
                    class="pb-2"
                    content={stringifyWithBigInt(details.heartbeatDetails)}
                    copyIconTitle={translate('common.copy-icon-title')}
                    copySuccessIconTitle={translate(
                      'common.copy-success-icon-title',
                    )}
                  />
                </li>
              {/if}
              {#if details.lastFailure}
                <li class="event-table-row">
                  <h4>{translate('workflows.last-failure')}</h4>
                  <CodeBlock
                    slot="value"
                    class="pb-2"
                    content={stringifyWithBigInt(details.lastFailure)}
                    copyIconTitle={translate('common.copy-icon-title')}
                    copySuccessIconTitle={translate(
                      'common.copy-success-icon-title',
                    )}
                  />
                </li>
              {/if}
              <li class="event-table-row">
                <h4>{translate('workflows.retry-expiration')}</h4>
                <p>
                  {formatRetryExpiration(
                    details.maximumAttempts,
                    formatDuration(
                      getDuration({
                        start: Date.now(),
                        end: details.expirationTime,
                      }),
                    ),
                  )}
                </p>
              </li>
            {/if}
            <li class="event-table-row">
              <h4>{translate('workflows.last-heartbeat')}</h4>
              <p>
                {formatDate(details.lastHeartbeatTime, $timeFormat, {
                  relative: $relativeTime,
                  relativeStrict: true,
                })}
              </p>
            </li>
            <li class="event-table-row">
              <h4>{translate('workflows.state')}</h4>
              <p>{details.state}</p>
            </li>
            {#if details.lastStartedTime}
              <li class="event-table-row">
                <h4>{translate('workflows.last-started-time')}</h4>
                <p>
                  {formatDate(details.lastStartedTime, $timeFormat, {
                    relative: $relativeTime,
                  })}
                </p>
              </li>
            {/if}
            {#if details.scheduledTime}
              <li class="event-table-row">
                <h4>{translate('workflows.scheduled-time')}</h4>
                <p>
                  {formatDate(details.scheduledTime, $timeFormat, {
                    relative: $relativeTime,
                  })}
                </p>
              </li>
            {/if}
            {#if details.lastWorkerIdentity}
              <li class="event-table-row">
                <h4>{translate('workflows.last-worker-identity')}</h4>
                <p>{details.lastWorkerIdentity}</p>
              </li>
            {/if}
          </ul>
        </td>
      </TableRow>
    {/each}
  </Table>
{:else}
  <EmptyState title={translate('workflows.pending-activities-empty-state')} />
{/if}

<style lang="postcss">
  .event-table-row {
    @apply grid grid-cols-2 border-b border-gray-300 py-1;
  }

  .event-table-row:last-child {
    @apply border-0;
  }
</style>
