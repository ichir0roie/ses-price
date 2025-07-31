"use client";

import CalcPage from "@/components/CalcPage";

import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import outputs from "../../../amplify_outputs.json";

Amplify.configure(outputs);

export default function Authed() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <CalcPage login={true} signOut={signOut} user={user} />
      )}
    </Authenticator>
  );
}
