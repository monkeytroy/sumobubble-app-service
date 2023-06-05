import { ReactElement } from "react";
import ConsoleHeading, { IConsoleHeadingProps } from "./console-heading";

interface IConsoleBody extends  IConsoleHeadingProps {
  children : ReactElement
  full?: boolean
}

export function ConsoleBody (props: IConsoleBody) {

  let classes = 'max-w-xl w-full select-none';
  if (props.full) {
    classes = 'w-full select-none'
  }

  return (
    <div className="w-full">
      <ConsoleHeading {...props}/>

      <div className={classes}>
        {props.children}
      </div>
    </div>
  );

}