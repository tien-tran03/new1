import { Editor, Element, Frame } from '@craftjs/core';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  AddElementsComponent,
  AddElementsHeader,
  DeviceMockup,
  LeftSideBar,
  RightSidebar,
} from '../../components/add_elements';
import { LayerComponent } from '../../components/add_elements/components/layer';
import { componentMap } from '../../components/add_elements/components/layout_map';
import { getBaseApiUrl } from '../../config_helper';
import { selectAccessToken, useAppSelector } from '../../redux_logic';
import { LayoutComponent } from '../../components/add_elements/components/layout';

export const PageDetail = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { pageAlias, projectAlias } = useParams();
  const editorRef = useRef<HTMLDivElement>(null);
  const token = useAppSelector(selectAccessToken);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        Swal.fire({
          title: 'Loading...',
          text: 'Please wait while we fetch the page data.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const response = await axios.get(`${getBaseApiUrl()}/page-detail/${projectAlias}/${pageAlias}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.data || !response.data.page) {
          throw new Error('Page data not found');
        }

        setPageData(response.data.page);
        setLoading(false);
        Swal.close();
      } catch (error) {
        console.error('Error fetching page data:', error);
        toast.error('Could not load page data');
        setLoading(false);
        Swal.close();
      }
    };

    if (projectAlias && pageAlias) {
      fetchPageData();
    }
  }, [projectAlias, pageAlias, token]);

  const handleComponentChange = (component: string | null) => {
    setActiveComponent(component);
  };

  const renderSidebarContent = () => {
    switch (activeComponent) {
      case 'add':
        return <AddElementsComponent />;
      case 'layers':
        return <LayerComponent />;
        case 'layout':
        return <LayoutComponent />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Editor resolver={componentMap}>
      <div className="flex flex-col h-screen overflow-hidden">
        <AddElementsHeader pageData={pageData} editorRef={editorRef as React.RefObject<HTMLDivElement>} />
        <div className="flex flex-1 overflow-hidden">
          <LeftSideBar onComponentChange={handleComponentChange} />
          {renderSidebarContent()}
          <div className="flex flex-col flex-grow w-full overflow-y-auto">
            <div ref={editorRef} className="flex items-center justify-center w-full h-[calc(100vh-4rem)] bg-gray-100">
              <Frame data={(pageData as any)?.sections || null}>
                <Element canvas is={DeviceMockup} />
              </Frame>
            </div>
          </div>
          <RightSidebar />
        </div>
      </div>
    </Editor>
  );
}; 