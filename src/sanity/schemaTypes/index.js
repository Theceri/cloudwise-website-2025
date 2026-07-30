import { blockContent } from './blockContent';
import { category } from './category';
import { author } from './author';
import { post } from './post';
import { comment } from './comment';
import { siteSettings } from './siteSettings';
import { trainingRegistration } from './trainingRegistration';
import { trainingPayment } from './trainingPayment';
import { systemLock } from './systemLock';

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
    systemLock,
    // Objects
    blockContent,
  ],
};
