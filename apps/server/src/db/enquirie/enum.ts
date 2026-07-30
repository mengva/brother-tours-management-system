import { pgEnum } from "drizzle-orm/pg-core";

export const enquiryStatusEnum = pgEnum('enquiry_status', [
    'NewEnquiry',
    'Reviewing',
    'ProposalSent',
    'FollowUp',
    'Confirmed',
    'Lost',
]);