import {
  DocumentTextIcon,
  UserIcon,
  TagIcon,
  CommentIcon,
  CogIcon,
  UsersIcon,
  CreditCardIcon,
  CalendarIcon,
} from '@sanity/icons';

import { listOpenCohorts, formatDay, TRACKS, TRACK_WBH } from '@/lib/training';

const trackList = (S, title, track) =>
  S.documentList()
    .title(title)
    .filter('_type == "trainingRegistration" && track == $track')
    .params({ track })
    .defaultOrdering(byNewest);

const byNewest = [{ field: 'createdAt', direction: 'desc' }];

/** One list item per upcoming individual-track cohort, plus its roster. */
function cohortItems(S) {
  return listOpenCohorts({ count: 8 }).map((cohort) =>
    S.listItem()
      .title(cohort.monthLabel)
      .id(`cohort-${cohort.id}`)
      .icon(CalendarIcon)
      .child(
        S.documentList()
          .title(cohort.label)
          .filter('_type == "trainingRegistration" && cohortId == $cohortId')
          .params({ cohortId: cohort.id })
          .defaultOrdering(byNewest)
      )
  );
}

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
        .title('Training')
        .icon(UsersIcon)
        .child(
          S.list()
            .title('Training')
            .items([
              S.listItem()
                .title('💜 Women Biz360 masterclass')
                .icon(UsersIcon)
                .child(
                  S.documentList()
                    .title(`Masterclass · ${formatDay(TRACKS[TRACK_WBH].eventDate)}`)
                    .filter('_type == "trainingRegistration" && track == "wbh-masterclass"')
                    .defaultOrdering(byNewest)
                ),

              S.listItem()
                .title('⚡ Kickstart (Ksh 500)')
                .icon(UsersIcon)
                .child(trackList(S, 'AI Kickstart', 'kickstart')),

              S.listItem()
                .title('🧩 Essentials (Ksh 5,500)')
                .icon(UsersIcon)
                .child(trackList(S, 'AI Essentials', 'essentials')),

              S.listItem()
                .title('🎓 Programme (Ksh 13,500)')
                .icon(UsersIcon)
                .child(trackList(S, 'AI Productivity Programme', 'individual')),

              S.listItem()
                .title('📅 Individual cohorts')
                .icon(CalendarIcon)
                .child(S.list().title('Individual cohorts').items(cohortItems(S))),

              S.divider(),

              S.listItem()
                .title('✅ Paid')
                .icon(UsersIcon)
                .child(
                  S.documentList()
                    .title('Paid registrations')
                    .filter('_type == "trainingRegistration" && status == "paid"')
                    .defaultOrdering(byNewest)
                ),

              S.listItem()
                .title('👥 Team leads')
                .icon(UsersIcon)
                .child(
                  S.documentList()
                    .title('Team leads (colleagues, or 3+ people)')
                    .filter('_type == "trainingRegistration" && teamLead == true')
                    .defaultOrdering(byNewest)
                ),

              S.listItem()
                .title('🟡 Awaiting payment')
                .icon(UsersIcon)
                .child(
                  S.documentList()
                    .title('Awaiting payment')
                    .filter('_type == "trainingRegistration" && status == "pending"')
                    .defaultOrdering(byNewest)
                ),

              S.listItem()
                .title('All registrations')
                .icon(UsersIcon)
                .child(
                  S.documentTypeList('trainingRegistration')
                    .title('All registrations')
                    .defaultOrdering(byNewest)
                ),

              S.divider(),

              S.listItem()
                .title('💳 Payments')
                .icon(CreditCardIcon)
                .child(
                  S.documentTypeList('trainingPayment')
                    .title('Payments')
                    .defaultOrdering(byNewest)
                ),

              S.listItem()
                .title('🔎 Payments by receipt')
                .icon(CreditCardIcon)
                .child(
                  S.documentTypeList('trainingPayment')
                    .title('Search payments by M-Pesa code')
                    .defaultOrdering([{ field: 'receipt', direction: 'asc' }])
                ),

              S.listItem()
                .title('🎟️ Credits')
                .icon(CreditCardIcon)
                .child(S.documentTypeList('trainingCredit').title('Credits').defaultOrdering(byNewest)),

              S.listItem()
                .title('🎓 Certificates')
                .icon(UsersIcon)
                .child(S.documentTypeList('trainingCertificate').title('Certificates')),

              S.listItem()
                .title('⭐ Reviews')
                .icon(UsersIcon)
                .child(S.documentTypeList('trainingReview').title('Reviews')),

              S.listItem()
                .title('🏢 Team enquiries')
                .icon(UsersIcon)
                .child(S.documentTypeList('teamEnquiry').title('Team enquiries').defaultOrdering(byNewest)),

              S.listItem()
                .title('🏦 Daily bank sweeps')
                .icon(CreditCardIcon)
                .child(S.documentTypeList('settlementBatch').title('Daily bank sweeps').defaultOrdering(byNewest)),

              S.listItem()
                .title('🏦 Awaiting bank settlement')
                .icon(CreditCardIcon)
                .child(
                  S.documentList()
                    .title('Awaiting bank settlement')
                    .filter(
                      '_type == "trainingPayment" && status == "completed" && settlementState in ["pending", "queued", "settling", "failed"]'
                    )
                    .defaultOrdering(byNewest)
                ),
            ])
        ),

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
