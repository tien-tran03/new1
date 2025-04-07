import React, { useState } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { getVideoPlayerPropertiesDefaults } from "./videoplayer-properties";
import { DeleteContextMenu } from "../../../delete_context_menu/delete-context-menu";
import { VideoPlayerProperties } from "./properties-videoplayer-pannel";

interface VideoPlayerProps extends Partial<ReturnType<typeof getVideoPlayerPropertiesDefaults>> {}

export const VideoPlayerLayout: React.FC<VideoPlayerProps> & { craft: any } = (props) => {
  const {
    connectors: { connect, drag },
    selected,
    id,
  } = useNode((node) => ({
    selected: node.events.selected,
    id: node.id,
  }));

  const { actions } = useEditor();
  const [isHovered, setIsHovered] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const defaultProps = getVideoPlayerPropertiesDefaults();
  const {
    src = defaultProps.src,
    width = defaultProps.width,
    height = defaultProps.height,
    controls = defaultProps.controls,
    autoplay = defaultProps.autoplay,
    loop = defaultProps.loop,
    muted = defaultProps.muted,
    poster = defaultProps.poster,
    playbackRate = defaultProps.playbackRate,
    padding = defaultProps.padding,
    margin = defaultProps.margin,
    backgroundColor = defaultProps.backgroundColor,
    border = defaultProps.border,
    start = defaultProps.start,
    end = defaultProps.end,
    showRelated = defaultProps.showRelated,
  } = props;

  const videoStyle = {
    width,
    height,
    padding,
    margin,
    backgroundColor,
    border,
    outline: selected ? "2px solid #3b82f6" : "none",
    display: "block",
    boxSizing: "border-box" as const,
    transition: "outline 0.2s ease",
  };

  const isYouTube = src.includes("youtube.com/embed") || src.includes("youtu.be");
  const youTubeParams = `?start=${start}${end ? `&end=${end}` : ""}${showRelated ? "" : "&rel=0"}&autoplay=${autoplay ? 1 : 0}`;
  const youTubeSrc = isYouTube ? `${src}${youTubeParams}` : src;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.selectNode(id);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({ x: event.pageX, y: event.pageY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`relative cursor-move transition-all ${isHovered || selected ? "border border-dashed border-gray-400" : ""}`}
      onContextMenu={handleContextMenu}
      onClick={handleCloseContextMenu}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isYouTube ? (
        <iframe
          src={youTubeSrc}
          width={width}
          height={height}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={videoStyle}
          onClick={handleClick}
        />
      ) : (
        <video
          src={src}
          width={width}
          height={height}
          controls={controls}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          poster={poster}
          playbackRate={playbackRate}
          onClick={handleClick}
          style={videoStyle}
        />
      )}
      <DeleteContextMenu
        nodeId={id}
        onClose={handleCloseContextMenu}
        position={contextMenu}
        onDelete={() => actions.delete(id)}
      />
    </div>
  );
};

VideoPlayerLayout.craft = {
  displayName: "VideoPlayerLayout",
  props: getVideoPlayerPropertiesDefaults(),
  rules: {
    canDrag: () => true,
    canDrop: () => true,
  },
  related: {
    toolbar: VideoPlayerProperties,
  },
};