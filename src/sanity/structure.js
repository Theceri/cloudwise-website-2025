import {
  DocumentTextIcon,
  UserIcon,
  TagIcon,
  CommentIcon,
  CogIcon,
} from '@sanity/icons';

/**
 * Custom Studio desk:
 * - Posts / Categories / Authors
 * - Comments split into Pending (moderation queue) and Approved
 * - Blog Settings as a singleton
 */
export const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Posts')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Posts')
            .items([
              S.listItem()
                .title('All posts')
                .icon(DocumentTextIcon)
                .child(S.documentTypeList('post').title('All posts')),
              S.listItem()
                .title('🟡 Ready for review')
                .icon(DocumentTextIcon)
                .child(
                  S.documentList()
                    .title('Ready for review')
                    .filter('_type == "post" && reviewStatus == "review"')
                    .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }])
                ),
            ])
        ),

      S.listItem()
        .title('Categories')
        .icon(TagIcon)
        .child(S.documentTypeList('category').title('Categories')),

      S.listItem()
        .title('Authors')
        .icon(UserIcon)
        .child(S.documentTypeList('author').title('Authors')),

      S.divider(),

      S.listItem()
        .title('Comments')
        .icon(CommentIcon)
        .child(
          S.list()
            .title('Comments')
            .items([
              S.listItem()
                .title('🟡 Pending moderation')
                .icon(CommentIcon)
                .child(
                  S.documentList()
                    .title('Pending comments')
                    .filter('_type == "comment" && approved != true')
                    .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('✅ Approved')
                .icon(CommentIcon)
                .child(
                  S.documentList()
                    .title('Approved comments')
                    .filter('_type == "comment" && approved == true')
                    .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                ),
            ])
        ),

      S.divider(),

      S.listItem()
        .title('Blog Settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Blog Settings')
        ),
    ]);
