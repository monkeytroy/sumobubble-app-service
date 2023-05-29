import { ReactElement } from "react";
import ConsoleHeading, { IConsoleHeadingProps } from "./console-heading";

interface IConsoleBody extends  IConsoleHeadingProps {
  children : ReactElement
}

export function ConsoleBody (props: IConsoleBody) {

  return (
    <div className="w-full">
      <ConsoleHeading {...props}/>

      <div className="max-w-xl w-full select-none">
        {props.children}
      </div>
    </div>
  );

}