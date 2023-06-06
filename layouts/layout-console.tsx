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
      <div className="fixed min-h-screen w-48 md:w-64 overflow-hidden ">
        <NavSide></NavSide>
      </div>

      <div className="flex flex-col grow ml-48 md:ml-60 mt-16 px-6 overflow-hidden">
        <ToastContainer />
        <div className="min-h-screen max-w-full overflow-hidden px-4">
          <main>{children}</main>
        </div>
        <Footer></Footer>
      </div>

      <script type="module" src="http://localhost:5173/dist/infochat-app.js" 
        id="infochat-app-scriptastic"></script>
      <infochat-app preview="true" site="647c1c4f427a3a36d0e939a0"></infochat-app>
      
    </div>
  )
}