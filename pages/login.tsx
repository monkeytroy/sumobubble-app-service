import LoginForm from "@/components/login-form";
import { ReactElement } from "react";
import LayoutPlain from "@/components/layout-plain";

export default function Login() {
  return (
    <LoginForm></LoginForm>
  )
}

Login.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutPlain>
      {page}
    </LayoutPlain>
  )
}