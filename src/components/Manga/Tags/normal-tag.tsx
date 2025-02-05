import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export default function NormalTag(props: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "flex items-center gap-1 px-[0.375rem] py-0 bg-accent font-bold rounded-[0.25rem] text-[0.625rem]",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
