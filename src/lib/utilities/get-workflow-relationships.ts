import type { DescribeNamespaceResponse } from '$lib/types';
import type {
  ChildWorkflowExecutionCanceledEvent,
  ChildWorkflowExecutionCompletedEvent,
  ChildWorkflowExecutionFailedEvent,
  ChildWorkflowExecutionTerminatedEvent,
  ChildWorkflowExecutionTimedOutEvent,
  WorkflowEvent,
  WorkflowEvents,
} from '$lib/types/events';
import type { WorkflowExecution } from '$lib/types/workflows';
import type { WorkflowIdentifier } from '$lib/types/workflows';

import { has } from './has';
import { isString } from './is';
import {
  isChildWorkflowExecutionCanceledEvent,
  isChildWorkflowExecutionCompletedEvent,
  isChildWorkflowExecutionFailedEvent,
  isChildWorkflowExecutionTerminatedEvent,
  isChildWorkflowExecutionTimedOutEvent,
  isWorkflowExecutionStartedEvent,
} from './is-event-type';
import type { StartAndEndEventHistory } from '../stores/events';

const getNewExecutionId = (events: WorkflowEvents): string | undefined => {
  for (const event of events) {
    if (
      has(event.attributes, 'newExecutionRunId') &&
      isString(event.attributes.newExecutionRunId)
    ) {
      return event.attributes.newExecutionRunId;
    }
  }
};

export type ChildWorkflowClosedEvent =
  | ChildWorkflowExecutionCompletedEvent
  | ChildWorkflowExecutionFailedEvent
  | ChildWorkflowExecutionCanceledEvent
  | ChildWorkflowExecutionTimedOutEvent
  | ChildWorkflowExecutionTerminatedEvent;

export const isChildWorkflowClosedEvent = (event: WorkflowEvent) => {
  return (
    isChildWorkflowExecutionCompletedEvent(event) ||
    isChildWorkflowExecutionFailedEvent(event) ||
    isChildWorkflowExecutionCanceledEvent(event) ||
    isChildWorkflowExecutionTimedOutEvent(event) ||
    isChildWorkflowExecutionTerminatedEvent(event)
  );
};

type WorkflowRelationships = {
  hasRelationships: boolean;
  hasChildren: boolean;
  children: ChildWorkflowClosedEvent[];
  first: string | undefined;
  previous: string | undefined;
  parent: WorkflowIdentifier | undefined;
  parentNamespaceName: string | undefined;
  next: string | undefined;
  scheduleId: string | undefined;
};

export const getWorkflowRelationships = (
  workflow: WorkflowExecution | null,
  eventHistory: StartAndEndEventHistory,
  fullEventHistory: WorkflowEvents,
  namespaces: DescribeNamespaceResponse[],
): WorkflowRelationships => {
  const children = fullEventHistory.filter((event) =>
    isChildWorkflowClosedEvent(event),
  ) as ChildWorkflowClosedEvent[];
  const hasChildren = !!workflow?.pendingChildren.length || !!children.length;
  const parent = workflow?.parent;

  const parentNamespaceName = namespaces?.find((namespace) => {
    return namespace.namespaceInfo.id === workflow.parentNamespaceId;
  })?.namespaceInfo?.name;

  const workflowExecutionStartedEvent = eventHistory.start.find(
    isWorkflowExecutionStartedEvent,
  );

  const newExecutionRunId = getNewExecutionId(eventHistory.end);

  const firstExecutionRunId =
    workflowExecutionStartedEvent?.attributes?.firstExecutionRunId;

  const first =
    firstExecutionRunId === workflow?.runId ? undefined : firstExecutionRunId;

  const previous =
    workflowExecutionStartedEvent?.attributes?.continuedExecutionRunId;

  let scheduleId = '';
  const temporalScheduledById =
    workflow?.searchAttributes?.indexedFields?.TemporalScheduledById;

  if (typeof temporalScheduledById === 'string') {
    scheduleId = temporalScheduledById;
  }

  const hasRelationships = !!(
    parent ||
    hasChildren ||
    first ||
    previous ||
    newExecutionRunId ||
    scheduleId
  );

  return {
    hasRelationships,
    hasChildren,
    children,
    first,
    previous,
    parent,
    parentNamespaceName,
    next: newExecutionRunId,
    scheduleId,
  };
};
