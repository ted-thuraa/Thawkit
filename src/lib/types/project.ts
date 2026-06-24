import {
  roleEnum,
  teamRolesEnum,
  teamPermissionsEnum,
  toolTypeEnum,
  accessTypeEnum,
  invitationStatusEnum,
  fieldTypeEnum,
  questionTypeEnum,
  questionDiaplayPageEnum,
  pageTypesEnum,
  pageStatusEnum,
  orderTypesEnum,
  submissionStatusEnum,
  plansEnum,
  deviceTypeEnum,
  eventTypeEnum,
  trafficSourceEnum,
  authDecisionEnum,
} from "@/drizzle/schemas/enums";
import {
  funnelPages,
  funnels,
  projectQuizFields,
  projects,
  quizFieldCategories,
  quizFieldOptions,
  scoreTiers,
} from "@/drizzle/schema";
import { InferEnum, InferSelectModel } from "drizzle-orm";

export type RoleEnum = InferEnum<typeof roleEnum>;
export type TeamRolesEnum = InferEnum<typeof teamRolesEnum>;
export type TeamPermissionsEnum = InferEnum<typeof teamPermissionsEnum>;

export type ToolTypeEnum = InferEnum<typeof toolTypeEnum>;
export type AccessTypeEnum = InferEnum<typeof accessTypeEnum>;

export type InvitationStatusEnum = InferEnum<typeof invitationStatusEnum>;

export type FieldTypeEnum = InferEnum<typeof fieldTypeEnum>;
export type QuestionTypeEnum = InferEnum<typeof questionTypeEnum>;
export type QuestionDisplayPageEnum = InferEnum<typeof questionDiaplayPageEnum>;

export type PageTypesEnum = InferEnum<typeof pageTypesEnum>;
//export type PageStatusEnum = InferEnum<typeof pageStatusEnum>;
export type OrderTypesEnum = InferEnum<typeof orderTypesEnum>;

export type SubmissionStatusEnum = InferEnum<typeof submissionStatusEnum>;

export type PlansEnum = InferEnum<typeof plansEnum>;

export type DeviceTypeEnum = InferEnum<typeof deviceTypeEnum>;

export type EventTypeEnum = InferEnum<typeof eventTypeEnum>;

export type TrafficSourceEnum = InferEnum<typeof trafficSourceEnum>;

export type AuthDecisionEnum = InferEnum<typeof authDecisionEnum>;

// Base model types
export type ProjectModel = InferSelectModel<typeof projects>;
export type FormFieldModel = InferSelectModel<typeof projectQuizFields>;
export type CategoryModel = InferSelectModel<typeof quizFieldCategories>;
export type OptionModel = InferSelectModel<typeof quizFieldOptions>;
export type FunnelModel = InferSelectModel<typeof funnels>;
export type FunnelPageModel = InferSelectModel<typeof funnelPages>;
export type ScoreTiersModel = InferSelectModel<typeof scoreTiers>;

export interface ScoreTiers
  extends Pick<
    ScoreTiersModel,
    "id" | "name" | "projectId" | "scoreColour" | "scoreFrom" | "scoreTo"
  > {}
export interface QuestionOption
  extends Pick<
    OptionModel,
    | "id"
    | "order"
    | "projectQuizFieldId"
    | "label"
    | "mediaType"
    | "mediaSrc"
    | "showIcon"
  > {}

export interface FormField
  extends Pick<
    FormFieldModel,
    | "id"
    | "order"
    | "title"
    | "description"
    | "formFieldType"
    | "type"
    | "context"
    | "displayPage"
    | "attachment"
    | "validations"
    | "logicBranch"
    | "scoring"
    | "settings"
    | "categoryIds"
  > {
  options: QuestionOption[];
}

export interface QuestionCategories
  extends Pick<
    CategoryModel,
    "id" | "order" | "icon" | "title" | "description"
  > {}

export interface FinalFunnelPage
  extends Pick<
    FunnelPageModel,
    | "id"
    | "title"
    | "type"
    | "status"
    | "defaultPage"
    | "order"
    | "pathName"
    | "metaTitle"
    | "metaDescription"
    | "previewImage"
    | "scripts"
    | "theme"
    | "settings"
    | "content"
  > {}

export interface MinimalFunnelPage
  extends Pick<
    FunnelPageModel,
    | "id"
    | "title"
    | "type"
    | "status"
    | "defaultPage"
    | "order"
    | "pathName"
    | "previewImage"
  > {}

export type PageStatusEnum = "Draft" | "Published";
