import { useState } from 'react';

interface DragState<T> {
    draggedItem: T | null;
    draggedIndex: number | null;
    placeholderIndex: number | null;
    offsetX: number;
    offsetY: number;
}

const initialDragState = {
    draggedItem: null,
    draggedIndex: null,
    placeholderIndex: null,
    offsetX: 0,
    offsetY: 0,
};

// Hook for drag-and-drop functionality
export function useDragAndDrop<T>(items: T[], setItems: (items: T[]) => void) {
    const [dragState, setDragState] = useState<DragState<T>>(initialDragState);

    const handleDragStart = (item: T, index: number, event: React.MouseEvent) => {
        const offsetX = event.clientX - event.currentTarget.getBoundingClientRect().left;
        const offsetY = event.clientY - event.currentTarget.getBoundingClientRect().top;

        setDragState({
            draggedItem: item,
            draggedIndex: index,
            placeholderIndex: index,
            offsetX,
            offsetY,
        });
    };

    const handleDrag = (event: React.MouseEvent) => {
        if (!dragState.draggedItem) return;

        const currentY = event.clientY;
        const hoveredIndex = items.findIndex((_, index) => {
            const rect = document.getElementById(`draggable-item-${index}`)?.getBoundingClientRect();
            return rect && currentY > rect.top && currentY < rect.bottom;
        });

        if (hoveredIndex !== -1 && hoveredIndex !== dragState.placeholderIndex) {
            setDragState((prev) => ({
                ...prev,
                placeholderIndex: hoveredIndex,
            }));
        }
    };

    const handleDragEnd = () => {
        if (dragState.placeholderIndex !== null && dragState.draggedIndex !== null) {
            const reorderedItems = [...items];
            reorderedItems.splice(dragState.draggedIndex, 1); // Remove from old index
            reorderedItems.splice(dragState.placeholderIndex, 0, dragState.draggedItem!); // Insert at new index

            setItems(reorderedItems);
        }

        setDragState(initialDragState);
    };

    return {
        dragState,
        handleDragStart,
        handleDrag,
        handleDragEnd,
    };
}
