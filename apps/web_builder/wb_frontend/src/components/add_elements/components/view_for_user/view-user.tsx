import { Editor, Frame } from '@craftjs/core';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { componentMap } from '../layout_map';
import { DeviceMockup } from '../main_element';

export const ViewForUser = () => {
  const { state } = useLocation();
  const objData = state?.layoutData ? JSON.parse(state.layoutData) : {};
  const width = state?.width || '840px';
  const height = state?.height || '500px';

  const myComponentMap = {
    ...componentMap,
    DeviceMockup: (props: any) => <DeviceMockup {...props} hideFrame={true} />,
  };

  return (
    <Editor 
      enabled={false} 
      resolver={myComponentMap}
    >
      <Box
        sx={{
          width: width, 
          height: height, 
          background: '#fff',
          overflow: 'visible',
          padding: '10px',
          position: 'relative',
          pointerEvents: 'none', 
          userSelect: 'none', 
        }}
      >
        {state?.layoutData ? (
          <Frame data={objData} />
        ) : (
          <Box sx={{ textAlign: 'center', color: '#999', p: 2 }}>
            No layout data available
          </Box>
        )}
      </Box>
    </Editor>
  );
};