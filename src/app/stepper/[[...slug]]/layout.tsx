import React from "react";
import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

type Props = {
  children: React.ReactNode;
  params: { domain: string };
};

const FunnelLayout = async ({ children, params }: Props) => {
  return <div>{children}</div>;
};

export default FunnelLayout;
