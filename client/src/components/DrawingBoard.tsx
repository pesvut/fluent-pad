import React, { useEffect } from 'react';
import './App.scss';
import { useRealtimeDrawer, useRealtimeViewer } from 'react-realtime-drawing';

interface Props {
    height: number;
    onChnge?: (e: any) => void;
}

export const DrawingBoard: React.FC<Props> = ({ onChnge, height }) => {
    const [color, setColor] = React.useState('#134e6f');
    const [strokeWidth, setStrokeWidth] = React.useState(16);
    const [viewerRef, onChange, { reset: resetViewer }] = useRealtimeViewer();

    const [drawerRef, { reset: resetDrawer, dirty }] = useRealtimeDrawer({
        color,
        strokeWidth,
        onChange,
    });

    const handleReset = React.useCallback(() => {
        resetDrawer();
        resetViewer();
    }, [resetDrawer, resetViewer]);

    useEffect(() => {});

    return (
        <>
            <div
                style={{
                    width: '100%',
                    height: height,
                    marginBottom: '0px',
                }}
                className="drawing-board"
            >
                <canvas
                    ref={drawerRef}
                    style={{ backgroundColor: 'white', backgroundImage: './grid.jpg' }}
                    onChange={onChnge}
                />
                <ul>
                    <li onClick={() => setColor('red')} style={{ float: 'left', marginRight: '2px' }}>
                        <div style={{ width: '15px', height: '17px', background: 'red' }} />
                    </li>
                    <li onClick={() => setColor('green')} style={{ float: 'left', marginRight: '2px' }}>
                        <div style={{ width: '15px', height: '17px', background: 'green' }} />
                    </li>
                    <li onClick={() => setColor('purple')} style={{ float: 'left', marginRight: '20px' }}>
                        <div style={{ width: '15px', height: '17px', background: 'purple' }} />
                    </li>
                </ul>
                <ul>
                    <li onClick={() => setStrokeWidth(4)} style={{ float: 'left', marginRight: '10px' }}>
                        <div style={{ width: '5px', height: '5px', background: 'black', borderRadius: '50%', marginTop: '6px' }} />
                    </li>
                    <li onClick={() => setStrokeWidth(10)} style={{ float: 'left', marginRight: '10px' }}>
                        <div style={{ width: '10px', height: '10px', background: 'black', borderRadius: '50%', marginTop: '3px' }} />
                    </li>
                    <li onClick={() => setStrokeWidth(16)} style={{ float: 'left', marginRight: '20px' }}>
                        <div style={{ width: '15px', height: '15px', background: 'black', borderRadius: '50%', marginTop: '0px' }} />
                    </li>
                </ul>
            </div>
            <button onClick={handleReset} style={{ marginTop: 0 }}>
                Reset
            </button>
        </>
    );
};
