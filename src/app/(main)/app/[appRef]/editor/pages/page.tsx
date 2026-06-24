import {
  ArrowLeftCircle,
  CheckCircleIcon,
  EyeIcon,
  Laptop,
  Redo2,
  Smartphone,
  Tablet,
  Undo2,
} from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

import Image from "next/image";
import { getLandingPageIdByProjectRef } from "@/lib/querries/funnel";

type Props = {
  params: {
    appRef: string;
  };
};

const Page = async ({ params }: Props) => {
  const landingPageId = await getLandingPageIdByProjectRef(params.appRef);
  if (!landingPageId) return redirect(`/app/${params.appRef}/`);

  if (landingPageId) {
    return redirect(
      `/app/${params.appRef}/editor/pages/landing/${landingPageId}`
    );
  }
  return <div className="">Not allowed</div>;
};

export default Page;
