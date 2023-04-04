import { ReactElement } from "react";
import { ToastContainer } from "react-toastify";
import Footer from "./footer";
import Nav from "./nav";
import NavSide from "./nav-side";

export default function Layout({ children } : { children: ReactElement }) {
  return (
    <div className="flex min-h-screen">
      <NavSide></NavSide>
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