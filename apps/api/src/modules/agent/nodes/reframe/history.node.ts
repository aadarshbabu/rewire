import { Logger } from '@nestjs/common';
import { UserJourneyService } from '../../services/user-journey.service';
import { ReframingAgentStateType } from '../../graph/states/reframing-state';

const logger = new Logger('ReframingHistoryNode');

/**
 * Workflow node responsible for orchestrating user history loading.
 * Delegates all database queries and aggregation to the UserJourneyService.
 */
export function createReframingHistoryNode(userJourneyService: UserJourneyService) {
  return async (state: ReframingAgentStateType): Promise<Partial<ReframingAgentStateType>> => {
    if (!state.userId) {
      logger.log('No userId provided in state; continuing with guest context.');
      return {};
    }

    logger.log(`Reframing history node delegating context retrieval for userId: ${state.userId}`);
    const userHistory = await userJourneyService.getUserHolisticHistory(state.userId);

    return { userHistory };
  };
}
