import React, { useRef, useState, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { alpha } from '@mui/material/styles';
import LayersIcon from '@mui/icons-material/Layers';
import { callGetAPI } from '../../../../api_utils';
import { ButtonLayout } from '../element_layout/button/button-layout';
import { ContainerLayout } from '../element_layout/container/container-layout';
import { TextLayout } from '../element_layout/text/text-layout';
import { DeviceMockup } from '../main_element';
import { ColumnLayout, HeadingLayout } from '../element_layout';
import { RowLayout } from '../element_layout';
import { LinkLayout } from '../element_layout/link/link-layout';
import { ImageLayout } from '../element_layout/image/image-layout';
import { ListLayout } from '../element_layout/list/list-layout';
import { TabsLayout } from '../element_layout/tabs/tabs-layout';
import { VideoPlayerLayout } from '../element_layout';
import { RadioLayout } from '../element_layout/radio/radio-layout';
import { GridLayout } from '../element_layout/grid/grid-layout';
import { CheckboxLayout } from '../element_layout/checkbox/checkbox-layout';
import { Column } from '../element_layout';
import { ColumnIcon } from '../element_layout';
import { NavigationMenuLayout } from '../element_layout/navigation/navigation-menu-layout';
import { DropdownLayout } from '../element_layout/dropdown/dropdown_layout';

export const componentMap = {
  ContainerLayout,
  DeviceMockup,
  TextLayout,
  ButtonLayout,
  ColumnLayout,
  LinkLayout,
  ImageLayout,
  ListLayout,
  TabsLayout,
  VideoPlayerLayout,
  RadioLayout,
  HeadingLayout,
  GridLayout,
  CheckboxLayout,
  RowLayout,
  Column,
  ColumnIcon,
  NavigationMenuLayout,
  DropdownLayout,
};

interface Layout {
  id: number;
  name: string;
  layout_data: any;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  thumbnail?: string; 
}

export const LayoutComponent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [layouts, setLayouts] = useState<Layout[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        setLoading(true);
        const response = await callGetAPI('/layout');
        const fetchedLayouts: Layout[] = response.data.layouts;
        setLayouts(fetchedLayouts);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching layouts');
      } finally {
        setLoading(false);
      }
    };

    fetchLayouts();
  }, []);

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
              Layout
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
        {isSidebarOpen && (
          <>
            {loading && (
              <Typography sx={{ p: 2, color: alpha('#ffffff', 0.7) }}>
                Loading...
              </Typography>
            )}
            {error && (
              <Typography sx={{ p: 2, color: '#ef4444' }}>
                Error: {error}
              </Typography>
            )}
            {!loading && !error && layouts.length === 0 && (
              <Typography sx={{ p: 2, color: alpha('#ffffff', 0.7) }}>
                No layouts found
              </Typography>
            )}
            {!loading && !error && layouts.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {layouts.map((layout) => (
                  <Box
                    key={layout.id}
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      bgcolor: alpha('#6366f1', 0.1),
                      '&:hover': {
                        bgcolor: alpha('#6366f1', 0.2),
                      },
                    }}
                  >
                    {layout.thumbnail ? (
                      <img
                        src={layout.thumbnail}
                        alt={`Thumbnail of ${layout.name}`}
                        style={{
                          width: '40%',
                          height: '20%',
                      
                        }}
                      />
                    ) : (
                      <Typography sx={{ fontSize: '0.75rem', color: alpha('#ffffff', 0.7) }}>
                        Thumbnail not available
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};