import React from "react";

import SectionContainer from "./elementTypes/sectionContainer";
import ColumnsContainer from "./elementTypes/columnsContainer";
import RowsContainer from "./elementTypes/rowsContainer";
import DivContainer from "./elementTypes/divContainer";
import GridContainer from "./elementTypes/gridContainer";
import SmartLayoutContainer from "./elementTypes/smartLayoutContainer";
import CategoryScoresComponent from "./elementTypes/categoryScoresComponent";
import TextComponent from "./elementTypes/textContainer";
import ImageComponent from "./elementTypes/imageContainer";
import DetailedCategoryScoreComponent from "./elementTypes/detailedCatScoresContainer";
import ButtonContainer from "./elementTypes/buttonContainer";
import VideoContainer from "./elementTypes/videoContainer";
import FaqLayoutContainer from "./elementTypes/faqContainer";
import CountDownTimerContainer from "./elementTypes/countDownTimerComponent";
import TestimonialsContainer from "./elementTypes/testimonialsComponent";
import QuizComponent from "./elementTypes/QuizComponent";
import MemefiedIndividualScoreComponent from "./elementTypes/memefiedIndividualScoreContainer";
import LandingPageQuizComponent from "./elementTypes/landingPageQuizContainer";
import LinksContainer from "./elementTypes/linksContainer";
import { QuestionComponent } from "./helpers/quizcanvas";
import IndividualScoreComponent from "./elementTypes/individualScoreComponent";
import { ElementNode } from "@/stores/pageEditorStore/types";
import CategoryScoresLong from "./elementTypes/categoryScoresLongContent";
import ProductCatalogueComponent from "./elementTypes/productCatalogue";
import NavContainer from "./elementTypes/navContainer";
import LandingPageFormRenderer from "./elementTypes/formComponent";
import { OutcomeScoreChartComponent } from "./elementTypes/outcomeScoresContainer";

type Props = {
  section: ElementNode;
};

const RecursiveElementRenderer = ({ section }: Props) => {
  switch (section.type) {
    case "navigation":
      return <NavContainer section={section} />;
    case "section":
      return <SectionContainer section={section} />;
    case "container":
      return <DivContainer section={section} />;
    case "columns":
      return <ColumnsContainer section={section} />;
    case "rows":
      return <RowsContainer section={section} />;
    case "div_block":
      return <DivContainer section={section} />;
    // case "ad_banner":
    //   return <AdBannerContainer section={section} />;
    case "grid":
      return <GridContainer section={section} />;
    case "faq":
      return <FaqLayoutContainer section={section} />;
    case "smart_layout":
      return <SmartLayoutContainer section={section} />;
    case "testimonial_Layout":
      return <TestimonialsContainer section={section} />;
    case "category_scores":
      return <CategoryScoresComponent section={section} />;
    case "category_scores_long":
      return <CategoryScoresComponent section={section} />;
    case "text":
      return <TextComponent section={section} />;
    case "buttons":
      return <ButtonContainer section={section} />;
    case "links":
      return <LinksContainer section={section} />;
    case "image":
      return <ImageComponent section={section} />;
    case "video":
      return <VideoContainer section={section} />;
    case "CountDownTimer":
      return <CountDownTimerContainer section={section} />;
    case "OutcomeScoreCharts":
      return <OutcomeScoreChartComponent section={section} />;
    case "IndividualScore":
      return <IndividualScoreComponent section={section} />;
    case "DetailedCategoryScores":
      return <CategoryScoresLong section={section} />;
    //return <DetailedCategoryScoreComponent section={section} />;

    case "quizCanvas":
      return <QuestionComponent section={section} />;
    case "form":
      return <LandingPageFormRenderer section={section} />;
    case "productCatalogue":
      return <ProductCatalogueComponent section={section} />;
    default:
      return null;
  }
};

export default RecursiveElementRenderer;
