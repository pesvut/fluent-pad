import React, { useRef } from 'react';
import { useRealtimeDrawer, useRealtimeViewer } from 'react-realtime-drawing';

interface Props {
    height: number;
    onChnge?: (e: any) => void;
}

export const DrawingBoard: React.FC<Props> = ({ onChnge, height }) => {
  const [viewerRef, onChange] = useRealtimeViewer();
  const [pointsArray, setPointsArray] = React.useState(null);

  const [drawerRef] = useRealtimeDrawer({
    color: 'black',
    onChange
  });

  return (
    <div>
      <div style={{ width: "100%", height: height, borderBottom: "5px solid red", }}>
        <canvas ref={drawerRef} style={{ backgroundColor: "white", border: "black"}} onChange={onChnge}/>
      </div>
    </div>
  );
}