import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../store';
import { DisplayStatus } from '../react-redux&middleware/redux/typesImports';
import { AudioVis } from './api/visualization/audioVis';
import { KeyboardDoubleArrowDownIcon } from '../muiImports';
import QRCodeSidePanel from '../components/QRCodeSidePanel';

type STTRendererProps = { transcript: string };

export const STTRenderer = ({ transcript }: STTRendererProps): JSX.Element => {
  const displayStatus = useSelector((state: RootState) => {
    return state.DisplayReducer as DisplayStatus;
  });

  function initialVal(value: number | undefined) {
    if (isNaN(Number(value)) || typeof value === 'undefined') return 4;
    return value;
  }

  function initialPos(value: number | undefined) {
    if (isNaN(Number(value)) || typeof value === 'undefined') return 8;
    return value;
  }

  let text_size = initialVal(displayStatus.textSize);
  let line_num = initialVal(displayStatus.rowNum);
  let line_height = 1 + 0.1 * displayStatus.lineHeight;
  let transformed_line_num = line_height * line_num * text_size * 1.18;
  let button_line_num = line_height * (line_num + 1) * text_size * 1.18;
  let line_pos = initialPos(displayStatus.linePos);

  // Ensure captions don't go below the screen bottom by adjusting position/rows
  let position_change = 0;
  while (line_pos * 6.25 + button_line_num > 93 && line_pos > 0) {
    position_change = 1;
    line_pos--;
  }

  let row_change = 0;
  while (line_pos * 6.25 + button_line_num > 93 && line_pos === 0) {
    row_change = 1;
    line_num--;
    transformed_line_num = line_height * line_num * text_size * 1.18;
    button_line_num = line_height * (line_num + 1) * text_size * 1.18;
  }

  const top = line_pos * 6.25;

  const dispatch = useDispatch();
  const handleLinePositionBound = (event: number) => {
    dispatch({ type: 'SET_POS', payload: event });
  };
  const handleRowNumberBound = (event: number) => {
    dispatch({ type: 'SET_ROW_NUM', payload: event });
  };
  if (position_change) handleLinePositionBound(line_pos);
  position_change = 0;
  if (row_change) handleRowNumberBound(line_num);
  row_change = 0;

  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (transcriptContainerRef.current && autoScroll) {
      transcriptContainerRef.current.scrollTop =
        transcriptContainerRef.current.scrollHeight;
    }
  }, [transcript, autoScroll]);

  const handleScroll = () => {
    if (!transcriptContainerRef.current) return;
    const isScrolledToBottom =
      transcriptContainerRef.current.scrollHeight -
        transcriptContainerRef.current.scrollTop <
      transcriptContainerRef.current.clientHeight + text_size;
    setAutoScroll(isScrolledToBottom);
  };

  const handleClick = () => setAutoScroll(true);

  return (
    <div>
      <AudioVis />

      {/* QR panel pinned on the right, above captions */}
      <div
      style={{
         position: 'fixed',
         right: 0,
         top: 0,
         width: '30vw',
         height: '100vh',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         boxSizing: 'border-box', // ensures border doesn't shrink content area
      }}
      >
      <QRCodeSidePanel />
      </div>

      {/* Captions area pinned on the left, below QR panel in stacking order */}
      <div
        ref={transcriptContainerRef}
        onScroll={handleScroll}
        id="captionsSpace"
        style={{
          position: 'fixed',
          width: '60vw',
          textAlign: 'left',
          fontSize: `${text_size}vh`,
          paddingLeft: '5%',
          paddingRight: '0%',
          paddingTop: '0%',
          left: 0,
          top: `${top}%`,
          overflowY: 'scroll',
          height: `${transformed_line_num}vh`,
          lineHeight: `${line_height * text_size * 1.18}vh`,
          color: displayStatus.textColor,
          wordSpacing: `${2 * displayStatus.wordSpacing}px`,
          zIndex: 1000,
        }}
      >
        {transcript}
      </div>

      {!autoScroll && (
        <button
          onClick={handleClick}
          style={{
            position: 'fixed',
            paddingTop: '0%',
            borderRadius: '34%',
            border: `5px solid ${displayStatus.secondaryColor}`,
            left: '5%',
            marginLeft: '50%',
            top: `calc(${top}% + ${button_line_num}vh)`,
            height: `${2 * 0.618 * text_size}vh`,
            width: `${2 * text_size}vh`,
            alignItems: 'center',
            justifyContent: 'center',
            color: displayStatus.textColor,
            backgroundColor: displayStatus.primaryColor,
            cursor: 'pointer',
            display: 'flex',
            zIndex: 1000,
          }}
          aria-label="Scroll to bottom"
          title="Scroll to bottom"
        >
          <KeyboardDoubleArrowDownIcon />
        </button>
      )}
    </div>
  );
};