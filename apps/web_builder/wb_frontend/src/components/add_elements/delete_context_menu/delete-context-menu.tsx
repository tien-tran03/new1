import React, { useEffect } from "react";
import { useEditor } from "@craftjs/core";
import { FiTrash2 } from "react-icons/fi";

interface DeleteContextMenuProps {
    nodeId: string;
    onClose: () => void;
    position: { x: number; y: number } | null;
    onDelete: () => void;
}
export const DeleteContextMenu: React.FC<DeleteContextMenuProps> = ({
    nodeId,
    onClose,
    position,
    onDelete,
}) => {
    const { actions } = useEditor();
    const handleDelete = () => {
        actions.delete(nodeId);
        onClose();
        if (onDelete) {
            onDelete();
        }
    };
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (position) {
                const menuElement = document.querySelector(".delete-context-menu"); 
                if (menuElement && !menuElement.contains(event.target as Node)) {
                    onClose();
                }
            }
        };

        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [position, onClose]);

    if (!position) return null;

    return (
        <div
            className="delete-context-menu absolute bg-gray-800 text-white shadow-lg rounded-md p-0 z-50 border border-gray-700 overflow-hidden"
            style={{
                minWidth: "150px",
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
        >
            <div className="py-2">
                <div
                    className="flex items-center gap-2 px-4 py-2.5 cursor-pointer hover:bg-indigo-600 transition-colors duration-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                    }}
                >
                    <FiTrash2 className="text-red-400" size={8} />
                    <span className="font-medium">Xoa</span>
                </div>
            </div>
        </div>
    );
};