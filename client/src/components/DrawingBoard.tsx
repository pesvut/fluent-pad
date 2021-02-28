import LC from "literallycanvas";
import "./literallycanvas.css";
import LiterallyCanvas from "literallycanvas/lib/js/core/LiterallyCanvas";
import defaultOptions from "literallycanvas/lib/js/core/defaultOptions";
import "./App.scss";
import { useState } from "react";

interface Props {
  width?: number;
  height?: number;
}

export const DrawingBoard: React.FC<Props> = ({}) => {
  const [hidden, setHidden] = useState(false);

  defaultOptions.backgroundColor = "white";
  defaultOptions.toolbarPosition = hidden ? "hidden" : "top";
  defaultOptions.imageUrlPrefix = "/lib/img";

  const lc = new LiterallyCanvas(defaultOptions);

  return (
    <>
      <div style={{ position: "relative" }}>
        <LC.LiterallyCanvasReactComponent lc={lc} />
      </div>
    </>
  );
};
