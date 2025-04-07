import React, { useRef, useState } from 'react';
import { Layers } from '@craftjs/layers';
import { Box, IconButton, Typography } from '@mui/material';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { alpha } from '@mui/material/styles';
import LayersIcon from '@mui/icons-material/Layers';

export const LayerComponent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      ref={sidebarRef}
      sx={{
        bgcolor: '#1e1e38',
        color: 'white',
        borderRight: '1px solid rgba(99, 102, 241, 0.1)',
        transition: 'width 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: isSidebarOpen ? '288px' : '48px',
        maxWidth: '288px',
        minWidth: 0,
      }}
    >

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
          height: '48px',
        }}
      >
        {isSidebarOpen && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LayersIcon sx={{ color: '#6366f1', fontSize: '1rem' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem', color: alpha('#ffffff', 0.9) }}>
              Layers
            </Typography>
          </Box>
        )}
        <IconButton
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          sx={{
            p: 1,
            borderRadius: '50%',
            color: alpha('#ffffff', 0.7),
            '&:hover': {
              bgcolor: alpha('#6366f1', 0.15),
            },
            transition: 'all 0.2s ease',
            width: '48px',
            height: '48px',
          }}
        >
          {isSidebarOpen ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          p: isSidebarOpen ? 1 : 0.5,
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 64px)',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none', 
        }}
      >
        {isSidebarOpen ? <Layers /> : <Box />}
      </Box>
    </Box>
  );
};