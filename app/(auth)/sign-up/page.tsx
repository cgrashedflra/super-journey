"use client";

import AuthForm from "@/components/forms/AuthForm";
import { signUpWithCredentials } from "@/lib/action/auth.action";
import { SignUpSchema } from "@/lib/validations";
import React from "react";

const Signup = () => {
  return (
    <AuthForm
      formType="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={{ email: "", password: "", name: "", username: "" }}
      onSubmit={signUpWithCredentials}
    />
  );
};

export default Signup;
