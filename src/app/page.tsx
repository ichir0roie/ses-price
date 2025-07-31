"use client";

import "@aws-amplify/ui-react/styles.css";
import CalcPage from "@/components/CalcPage";

export default function Home() {
  return <CalcPage login={false} user={undefined} signOut={undefined} />;
}
