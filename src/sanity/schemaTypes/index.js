import { blockContent } from './blockContent';
import { category } from './category';
import { author } from './author';
import { post } from './post';
import { comment } from './comment';
import { siteSettings } from './siteSettings';
import { trainingRegistration } from './trainingRegistration';
import { trainingPayment } from './trainingPayment';
import { systemLock } from './systemLock';
import { trainingCredit } from './trainingCredit';
import { teamEnquiry } from './teamEnquiry';
import { settlementBatch } from './settlementBatch';

export const schema = {
  types: [
    // Documents
    post,
    author,
    category,
    comment,
    siteSettings,
    trainingRegistration,
    trainingPayment,
    trainingCredit,
    teamEnquiry,
    settlementBatch,
    systemLock,
    // Objects
    blockContent,
  ],
};
