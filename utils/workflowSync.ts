import { WorkflowStage, LeadWorkflow, ChatCategory } from '../types';

export interface PipelineStageUpdate {
  pipelineName: string;
  newStageId: string;
  cardId: string;
}

const WORKFLOW_TO_PIPELINE_STAGE_MAP: Record<ChatCategory, Record<WorkflowStage, string>> = {
  [ChatCategory.LETTINGS]: {
    [WorkflowStage.LEAD_CAPTURE]: 'l1',
    [WorkflowStage.QUALIFICATION]: 'l2',
    [WorkflowStage.BOOKING_FOLLOWUPS]: 'l2',
    [WorkflowStage.PROPERTY_SUGGESTIONS]: 'l2',
    [WorkflowStage.REFERENCING]: 'l4',
    [WorkflowStage.NOTIFICATIONS]: 'l4',
    [WorkflowStage.FEEDBACK_SENTIMENT]: 'l3',
    [WorkflowStage.ONBOARDING]: 'l5'
  },
  [ChatCategory.SALES]: {
    [WorkflowStage.LEAD_CAPTURE]: 's1',
    [WorkflowStage.QUALIFICATION]: 's2',
    [WorkflowStage.BOOKING_FOLLOWUPS]: 's2',
    [WorkflowStage.PROPERTY_SUGGESTIONS]: 's2',
    [WorkflowStage.REFERENCING]: 's4',
    [WorkflowStage.NOTIFICATIONS]: 's4',
    [WorkflowStage.FEEDBACK_SENTIMENT]: 's3',
    [WorkflowStage.ONBOARDING]: 's5'
  },
  [ChatCategory.VALUATIONS]: {
    [WorkflowStage.LEAD_CAPTURE]: 'v1',
    [WorkflowStage.QUALIFICATION]: 'v2',
    [WorkflowStage.BOOKING_FOLLOWUPS]: 'v2',
    [WorkflowStage.PROPERTY_SUGGESTIONS]: 'v2',
    [WorkflowStage.REFERENCING]: 'v3',
    [WorkflowStage.NOTIFICATIONS]: 'v3',
    [WorkflowStage.FEEDBACK_SENTIMENT]: 'v3',
    [WorkflowStage.ONBOARDING]: 'v4'
  },
  [ChatCategory.COMPLIANCE]: {
    [WorkflowStage.LEAD_CAPTURE]: 'c1',
    [WorkflowStage.QUALIFICATION]: 'c1',
    [WorkflowStage.BOOKING_FOLLOWUPS]: 'c2',
    [WorkflowStage.PROPERTY_SUGGESTIONS]: 'c2',
    [WorkflowStage.REFERENCING]: 'c2',
    [WorkflowStage.NOTIFICATIONS]: 'c2',
    [WorkflowStage.FEEDBACK_SENTIMENT]: 'c3',
    [WorkflowStage.ONBOARDING]: 'c3'
  },
  [ChatCategory.MAINTENANCE]: {
    [WorkflowStage.LEAD_CAPTURE]: 'm1',
    [WorkflowStage.QUALIFICATION]: 'm1',
    [WorkflowStage.BOOKING_FOLLOWUPS]: 'm2',
    [WorkflowStage.PROPERTY_SUGGESTIONS]: 'm2',
    [WorkflowStage.REFERENCING]: 'm3',
    [WorkflowStage.NOTIFICATIONS]: 'm3',
    [WorkflowStage.FEEDBACK_SENTIMENT]: 'm3',
    [WorkflowStage.ONBOARDING]: 'm4'
  },
  [ChatCategory.INSPECTIONS]: {
    [WorkflowStage.LEAD_CAPTURE]: 'i1',
    [WorkflowStage.QUALIFICATION]: 'i1',
    [WorkflowStage.BOOKING_FOLLOWUPS]: 'i2',
    [WorkflowStage.PROPERTY_SUGGESTIONS]: 'i2',
    [WorkflowStage.REFERENCING]: 'i3',
    [WorkflowStage.NOTIFICATIONS]: 'i3',
    [WorkflowStage.FEEDBACK_SENTIMENT]: 'i3',
    [WorkflowStage.ONBOARDING]: 'i4'
  },
  [ChatCategory.MARKETING]: {
    [WorkflowStage.LEAD_CAPTURE]: 'mk1',
    [WorkflowStage.QUALIFICATION]: 'mk2',
    [WorkflowStage.BOOKING_FOLLOWUPS]: 'mk2',
    [WorkflowStage.PROPERTY_SUGGESTIONS]: 'mk2',
    [WorkflowStage.REFERENCING]: 'mk3',
    [WorkflowStage.NOTIFICATIONS]: 'mk3',
    [WorkflowStage.FEEDBACK_SENTIMENT]: 'mk3',
    [WorkflowStage.ONBOARDING]: 'mk4'
  },
  [ChatCategory.GENERAL]: {
    [WorkflowStage.LEAD_CAPTURE]: '',
    [WorkflowStage.QUALIFICATION]: '',
    [WorkflowStage.BOOKING_FOLLOWUPS]: '',
    [WorkflowStage.PROPERTY_SUGGESTIONS]: '',
    [WorkflowStage.REFERENCING]: '',
    [WorkflowStage.NOTIFICATIONS]: '',
    [WorkflowStage.FEEDBACK_SENTIMENT]: '',
    [WorkflowStage.ONBOARDING]: ''
  }
};

const CATEGORY_TO_PIPELINE_NAME: Record<ChatCategory, string> = {
  [ChatCategory.LETTINGS]: 'Lettings Progression',
  [ChatCategory.SALES]: 'Sales Progression',
  [ChatCategory.VALUATIONS]: 'Valuations',
  [ChatCategory.COMPLIANCE]: 'Compliance',
  [ChatCategory.MAINTENANCE]: 'Maintenance',
  [ChatCategory.INSPECTIONS]: 'Inspections',
  [ChatCategory.MARKETING]: 'Marketing',
  [ChatCategory.GENERAL]: ''
};

export function syncWorkflowToPipeline(
  chatId: string,
  workflow: LeadWorkflow,
  category: ChatCategory
): PipelineStageUpdate | null {
  if (category === ChatCategory.GENERAL) {
    return null;
  }

  const pipelineName = CATEGORY_TO_PIPELINE_NAME[category];
  const newStageId = WORKFLOW_TO_PIPELINE_STAGE_MAP[category][workflow.currentStage];

  if (!pipelineName || !newStageId) {
    return null;
  }

  return {
    pipelineName,
    newStageId,
    cardId: `pipe-${chatId}`
  };
}

export function updatePipelineStage(update: PipelineStageUpdate): void {
  try {
    const pipelinesData = localStorage.getItem('all_pipelines');
    if (!pipelinesData) {
      console.warn('No pipeline data found in localStorage');
      return;
    }

    const pipelines = JSON.parse(pipelinesData);
    const targetPipeline = pipelines[update.pipelineName];

    if (!targetPipeline) {
      console.warn(`Pipeline "${update.pipelineName}" not found`);
      return;
    }

    let cardToMove = null;
    let sourceStageId = null;

    for (const stage of targetPipeline) {
      const cardIndex = stage.cards.findIndex((c: any) => c.id === update.cardId);
      if (cardIndex !== -1) {
        cardToMove = stage.cards[cardIndex];
        sourceStageId = stage.id;
        stage.cards.splice(cardIndex, 1);
        break;
      }
    }

    if (!cardToMove) {
      console.warn(`Card "${update.cardId}" not found in pipeline`);
      return;
    }

    if (sourceStageId === update.newStageId) {
      const stage = targetPipeline.find((s: any) => s.id === sourceStageId);
      if (stage) {
        stage.cards.push(cardToMove);
      }
      return;
    }

    const targetStage = targetPipeline.find((s: any) => s.id === update.newStageId);
    if (targetStage) {
      targetStage.cards.push(cardToMove);
      localStorage.setItem('all_pipelines', JSON.stringify(pipelines));
      console.log(`✅ Moved card "${update.cardId}" from stage "${sourceStageId}" to "${update.newStageId}"`);
    } else {
      console.warn(`Target stage "${update.newStageId}" not found`);
      const originalStage = targetPipeline.find((s: any) => s.id === sourceStageId);
      if (originalStage) {
        originalStage.cards.push(cardToMove);
      }
    }
  } catch (error) {
    console.error('Error updating pipeline stage:', error);
  }
}
