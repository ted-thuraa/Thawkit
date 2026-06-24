import { mysqlEnum } from "drizzle-orm/mysql-core";

export const roleEnum = mysqlEnum(["ADMIN", "USER"] as const);
export const teamRolesEnum = mysqlEnum(["owner", "admin", "member"] as const);
export const teamPermissionsEnum = mysqlEnum([
  "manage_team",
  "manage_tools",
  "view_analytics",
  "manage_billing",
] as const);

export const toolTypeEnum = mysqlEnum(["score_quiz", "gpt_wrapper"] as const);
export const accessTypeEnum = mysqlEnum([
  "full_access",
  "limited_access",
] as const);
export const invitationStatusEnum = mysqlEnum([
  "ACCEPTED",
  "REVOKED",
  "PENDING",
] as const);
export const fieldTypeEnum = mysqlEnum([
  "TEXT",
  "YES_NO",
  "MULTIPLE_CHOICE",
  "RANGE",
  "CONTACT_FORM",
  "INFO_SCREEN",
  "IMAGE_BUTTON",
] as const);
export const questionTypeEnum = mysqlEnum(["LEAD_FORM", "QUIZ_FORM"] as const);
export const questionDiaplayPageEnum = mysqlEnum([
  "L_P",
  "Q_P",
  "R_P",
] as const);
export const pageTypesEnum = mysqlEnum([
  "Landing_Page",
  "Quiz_Page",
  "Result_Page",
] as const);
export const pageStatusEnum = mysqlEnum([
  "Draft",
  "Published",
  "Default",
  "Homepage",
] as const);
export const orderTypesEnum = mysqlEnum([
  "asc_categories",
  "asc",
  "branching_logic",
  "random",
]);

export const submissionStatusEnum = mysqlEnum([
  "RECEIVED",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "SPAM",
] as const);
export const plansEnum = mysqlEnum([
  "FREE",
  "STANDARD",
  "PRO_MONTHLY",
  "PRO_YEARLY",
  "ULTIMATE",
  "LIFETIME",
] as const);
export const deviceTypeEnum = mysqlEnum([
  "UNKNOWN",
  "DESKTOP",
  "MOBILE",
  "TABLET",
] as const);
export const eventTypeEnum = mysqlEnum([
  "PAGE_VIEW",
  "BUTTON_CLICK",
  "FORM_SUBMIT",
  "QUIZ_START",
  "QUIZ_COMPLETE",
  "QUIZ_ABANDON",
  "SECTION_SCROLL",
  "EXTERNAL_LINK_CLICK",
  "CONVERSION",
] as const);
export const trafficSourceEnum = mysqlEnum([
  "DIRECT",
  "SEARCH_ENGINE",
  "SOCIAL_MEDIA",
  "REFERRAL",
  "EMAIL",
  "CAMPAIGN",
  "UNKNOWN",
] as const);
export const authDecisionEnum = mysqlEnum(["GRANT", "DENY"] as const);
