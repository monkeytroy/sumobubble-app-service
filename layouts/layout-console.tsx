import { ReactElement } from "react";
import { ToastContainer } from "react-toastify";
import Footer from "../components/footer";
import Nav from "../components/nav";
import NavSide from "../components/nav-side";

export default function Layout({ children } : { children: ReactElement }) {
  return (
    <div className="flex min-h-screen">
      <div className="fixed w-full left-0 z-50">
        <Nav></Nav>
      </div>
      <div className="fixed min-h-screen">
        <NavSide></NavSide>
      </div>

      <div className="flex flex-col grow ml-64 mt-24 px-8">
        <ToastContainer />
        <div className="min-h-screen">
          <main>{children}</main>
        </div>
        <Footer></Footer>
      </div>
    </div>
  )
}