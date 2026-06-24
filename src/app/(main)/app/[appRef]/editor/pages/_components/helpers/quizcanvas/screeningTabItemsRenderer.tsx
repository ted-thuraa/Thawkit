import React from "react";
import { ElementNode, QuestionField } from "@/stores/pageEditorStore/types";
import QuestionRenderer from "./QuestionRenderer";
import QuestionRendererTab from "./QuestionTab";
import LeadFormItem from "./leadFormRenderer";
import InfoTabItem from "./infoItemRenderer";

type Props = {
  section: ElementNode;
  item: QuestionField;
};

const ScreeningTabItemRenderer = ({ item, section }: Props) => {
  if (!item) return null; // <-- FIX #1: Prevent crash

  switch (item.formFieldType) {
    case "QUESTION_ITEM":
      return <QuestionRenderer section={section} selectedQuestion={item} />;
    // return <QuestionRendererTab section={section} selectedQuestion={item} />;
    case "INFO_ITEM":
      //return <div className="text-gray-900">Info tab here</div>;
      return <InfoTabItem selectedTabItem={item} />;
    case "LEAD_FORM_ITEM":
      return <LeadFormItem section={section} />;

    default:
      return null;
  }
};

export default ScreeningTabItemRenderer;
