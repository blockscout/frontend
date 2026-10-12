// SPDX-License-Identifier: LicenseRef-Blockscout

import type { DragEndEvent, Modifier } from '@dnd-kit/core';
import { closestCenter, DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

import type { TableColumn } from './types';

import ColumnListRow from './ColumnListRow';

const MOUSE_ACTIVATION_CONSTRAINT = { distance: 5 };
const TOUCH_ACTIVATION_CONSTRAINT = { delay: 250, tolerance: 5 };

const restrictToVerticalAxis: Modifier = ({ transform }) => ({ ...transform, x: 0 });
const MODIFIERS = [ restrictToVerticalAxis ];

interface Props {
  readonly columns: ReadonlyArray<TableColumn>;
  readonly onMove: (fromIndex: number, toIndex: number) => void;
}

interface RowProps {
  readonly column: TableColumn;
}

const ColumnListSortableRow = ({ column }: RowProps) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: column.id });

  const rowStyle = React.useMemo(() => ({ transform: CSS.Translate.toString(transform), transition }), [ transform, transition ]);
  const handleProps = React.useMemo(
    () => ({ ...attributes, ...listeners, 'aria-label': `Reorder ${ column.name }` }),
    [ attributes, listeners, column.name ],
  );

  return (
    <ColumnListRow
      column={ column }
      rowRef={ setNodeRef }
      rowStyle={ rowStyle }
      handleRef={ setActivatorNodeRef }
      handleProps={ handleProps }
      isDragging={ isDragging }
    />
  );
};

const ColumnListSortable = ({ columns, onMove }: Props) => {
  const id = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: MOUSE_ACTIVATION_CONSTRAINT }),
    useSensor(TouchSensor, { activationConstraint: TOUCH_ACTIVATION_CONSTRAINT }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const ids = React.useMemo(() => columns.map((column) => column.id), [ columns ]);

  const handleDragEnd = React.useCallback(({ active, over }: DragEndEvent) => {
    const fromIndex = ids.indexOf(String(active.id));
    const toIndex = over ? ids.indexOf(String(over.id)) : -1;
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
      return;
    }
    onMove(fromIndex, toIndex);
  }, [ ids, onMove ]);

  return (
    <DndContext id={ id } sensors={ sensors } collisionDetection={ closestCenter } modifiers={ MODIFIERS } onDragEnd={ handleDragEnd }>
      <SortableContext items={ ids } strategy={ verticalListSortingStrategy }>
        { columns.map((column) => <ColumnListSortableRow key={ column.id } column={ column }/>) }
      </SortableContext>
    </DndContext>
  );
};

export default ColumnListSortable;
