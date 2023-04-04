import { ReactElement } from "react";
import { ToastContainer } from "react-toastify";
import Footer from "./footer";
import Nav from "./nav";

export default function LayoutPlain({ children } : { children: ReactElement }) {
  return (
    <div className="flex min-h-screen">
      <ToastContainer />
      <div className="flex flex-col grow">
        <Nav></Nav>
        <div className="px-16 py-4 grow">
          <main>{children}</main>
        </div>
        <Footer></Footer>
      </div>
    </div>
  )
}