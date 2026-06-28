import { blockContent } from './blockContent';
import { category } from './category';
import { author } from './author';
import { post } from './post';
import { comment } from './comment';
import { siteSettings } from './siteSettings';

export const schema = {
  types: [
    // Documents
    post,
    author,
    category,
    comment,
    siteSettings,
    // Objects
    blockContent,
  ],
};
