import { NodeViewWrapper } from "@tiptap/react";
import React from "react";

export const VariableComponent = (props: any) => {
  return (
    <NodeViewWrapper as="span" className="inline-block mx-1">
      <span className="bg-blue-100 text-blue-700 border border-blue-200 rounded-full px-2 py-0.5 text-xs font-semibold select-none whitespace-nowrap flex items-center gap-1">
        <span className="opacity-50 text-[10px] uppercase tracking-wider">
          {props.node.attrs.category}:
        </span>
        {props.node.attrs.label}
      </span>
    </NodeViewWrapper>
  );
};
