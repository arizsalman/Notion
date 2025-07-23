import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./KanbanBoard.css";
import CardModal from "./CardModal";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";

const initialData = {
  columns: {
    remember: {
      name: "Remember",
      items: [
        {
          title: "Life Lessons",
          notes: "",
          status: "Not Started",
          type: "Remember",
          subtasks: [],
        },
      ],
    },
    goals: {
      name: "Goals",
      items: [
        {
          title: "Spiritual",
          notes: "",
          status: "Not Started",
          type: "Goals",
          subtasks: [],
        },
        {
          title: "Social",
          notes: "",
          status: "Not Started",
          type: "Goals",
          subtasks: [],
        },
        {
          title: "Health",
          notes: "",
          status: "Not Started",
          type: "Goals",
          subtasks: [],
        },
      ],
    },
    grateful: {
      name: "Grateful For",
      items: [
        {
          title: "Person",
          notes: "",
          status: "Not Started",
          type: "Grateful For",
          subtasks: [],
        },
        {
          title: "Things you own",
          notes: "",
          status: "Not Started",
          type: "Grateful For",
          subtasks: [],
        },
        {
          title: "Internet",
          notes: "",
          status: "Not Started",
          type: "Grateful For",
          subtasks: [],
        },
      ],
    },
    habitsAdd: {
      name: "Habits to Add",
      items: [
        {
          title: "Gym",
          notes: "",
          status: "Not Started",
          type: "Habits to Add",
          subtasks: [],
        },
        {
          title: "Reading",
          notes: "",
          status: "Not Started",
          type: "Habits to Add",
          subtasks: [],
        },
      ],
    },
    habitsRemove: {
      name: "Habits to Remove",
      items: [
        {
          title: "Smoking",
          notes: "",
          status: "Not Started",
          type: "Habits to Remove",
          subtasks: [],
        },
      ],
    },
  },
};

const KanbanBoard = () => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("kanbanData");
    return saved ? JSON.parse(saved) : initialData;
  });
  const [columnOrder, setColumnOrder] = useState(() => {
    const saved = localStorage.getItem("columnOrder");
    return saved ? JSON.parse(saved) : Object.keys(initialData.columns);
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedColKey, setSelectedColKey] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [autoEditColKey, setAutoEditColKey] = useState(null);

  useEffect(() => {
    localStorage.setItem("kanbanData", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem("columnOrder", JSON.stringify(columnOrder));
  }, [columnOrder]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, type } = result;
    
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Handle column reordering
    if (type === 'COLUMN') {
      const newColumnOrder = Array.from(columnOrder);
      const [removed] = newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, removed);
      setColumnOrder(newColumnOrder);
      return;
    }

    // Handle card movement within/between columns
    const sourceCol = data.columns[source.droppableId];
    const destCol = data.columns[destination.droppableId];
    const sourceItems = Array.from(sourceCol.items);
    const [removed] = sourceItems.splice(source.index, 1);
    
    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, removed);
      setData({
        ...data,
        columns: {
          ...data.columns,
          [source.droppableId]: { ...sourceCol, items: sourceItems },
        },
      });
    } else {
      const destItems = Array.from(destCol.items);
      destItems.splice(destination.index, 0, removed);
      setData({
        ...data,
        columns: {
          ...data.columns,
          [source.droppableId]: { ...sourceCol, items: sourceItems },
          [destination.droppableId]: { ...destCol, items: destItems },
        },
      });
    }
  };

  const handleAddCard = (colKey) => {
    setData((prev) => {
      const col = prev.columns[colKey];
      // Only one new card at a time per column
      if (col.items.some((item) => item.isNew)) return prev;
      const newItems = [
        ...col.items,
        {
          title: "",
          notes: "",
          status: "Not Started",
          type: data.columns[colKey].name,
          subtasks: [],
          isNew: true,
        },
      ];
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [colKey]: { ...col, items: newItems },
        },
      };
    });
  };

  // Inline edit save for new card
  const handleInlineEdit = (colKey, idx, newTitle) => {
    setData((prev) => {
      const col = prev.columns[colKey];
      const newItems = [...col.items];
      const wasNew = !!newItems[idx].isNew;
      if (newTitle.trim() === "") {
        // Remove the new card if title is empty
        newItems.splice(idx, 1);
      } else {
        newItems[idx] = {
          ...newItems[idx],
          title: newTitle,
          notes: newTitle,
          isNew: false,
        };
      }
      // If this was a new card and user entered a title, add another new card for chaining
      if (wasNew && newTitle.trim() !== "") {
        newItems.push({
          title: "",
          notes: "",
          status: "Not Started",
          type: col.name,
          subtasks: [],
          isNew: true,
        });
      }
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [colKey]: { ...col, items: newItems },
        },
      };
    });
  };

  const handleCardClick = (colKey, card, idx) => {
    setSelectedColKey(colKey);
    setSelectedCard({ ...card, idx });
    setIsAddMode(false);
    setModalVisible(true);
  };

  const handleSaveCard = (updatedCard) => {
    if (isAddMode) {
      setData((prev) => {
        const col = prev.columns[selectedColKey];
        const newItems = [
          ...col.items,
          { ...updatedCard, notes: updatedCard.title },
        ];
        return {
          ...prev,
          columns: {
            ...prev.columns,
            [selectedColKey]: { ...col, items: newItems },
          },
        };
      });
    } else {
      setData((prev) => {
        const col = prev.columns[selectedColKey];
        const newItems = [...col.items];
        newItems[selectedCard.idx] = {
          ...updatedCard,
          notes: updatedCard.title,
        };
        return {
          ...prev,
          columns: {
            ...prev.columns,
            [selectedColKey]: { ...col, items: newItems },
          },
        };
      });
    }
    setIsAddMode(false);
  };

  const handleDeleteCard = (card) => {
    setData((prev) => {
      const col = prev.columns[selectedColKey];
      const newItems = col.items.filter((_, idx) => idx !== selectedCard.idx);
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [selectedColKey]: { ...col, items: newItems },
        },
      };
    });
    setModalVisible(false);
  };

  // Add column handlers
  const handleEditCol = (colKey, newName) => {
    setData((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [colKey]: {
          ...prev.columns[colKey],
          name: newName,
        },
      },
    }));
    if (autoEditColKey === colKey) setAutoEditColKey(null);
  };
  const handleDeleteCol = (colKey) => {
    setData((prev) => {
      const newCols = { ...prev.columns };
      delete newCols[colKey];
      return { ...prev, columns: newCols };
    });
  };
  const handleAddCol = () => {
    let base = "newCol";
    let idx = 1;
    while (data.columns[base + idx]) idx++;
    const newKey = base + idx;
    setData((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [newKey]: {
          name: "Untitled",
          items: [],
        },
      },
    }));
    setTimeout(() => setAutoEditColKey(newKey), 0);
  };
  const handleAddColLeft = (colKey) => {
    let base = "newCol";
    let idx = 1;
    while (data.columns[base + idx]) idx++;
    const newKey = base + idx;
    setData((prev) => {
      const entries = Object.entries(prev.columns);
      const newCols = {};
      let inserted = false;
      for (let i = 0; i < entries.length; i++) {
        if (entries[i][0] === colKey && !inserted) {
          newCols[newKey] = { name: "Untitled", items: [] };
          inserted = true;
        }
        newCols[entries[i][0]] = entries[i][1];
      }
      return { ...prev, columns: newCols };
    });
    setTimeout(() => setAutoEditColKey(newKey), 0);
  };
  const handleAddColRight = (colKey) => {
    let base = "newCol";
    let idx = 1;
    while (data.columns[base + idx]) idx++;
    const newKey = base + idx;
    setData((prev) => {
      const entries = Object.entries(prev.columns);
      const newCols = {};
      for (let i = 0; i < entries.length; i++) {
        newCols[entries[i][0]] = entries[i][1];
        if (entries[i][0] === colKey) {
          newCols[newKey] = { name: "Untitled", items: [] };
        }
      }
      return { ...prev, columns: newCols };
    });
    setTimeout(() => setAutoEditColKey(newKey), 0);
  };

  return (
    <div className="kanban-board">
      <h2>Subconscious Profile</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div
              className="kanban-columns"
              style={{ display: "flex", alignItems: "flex-start" }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {columnOrder.map((colKey, index) => {
                const col = data.columns[colKey];
                if (!col) return null;
                return (
                  <Draggable key={colKey} draggableId={colKey} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.8 : 1,
                        }}
                      >
                        <KanbanColumn
                          key={colKey}
                          colKey={colKey}
                          col={col}
                          onAddCard={handleAddCard}
                          onCardClick={handleCardClick}
                          onEditCol={handleEditCol}
                          onDeleteCol={handleDeleteCol}
                          onAddCol={handleAddCol}
                          onAddColLeft={handleAddColLeft}
                          onAddColRight={handleAddColRight}
                          autoEdit={autoEditColKey === colKey}
                          dragHandleProps={provided.dragHandleProps}
                        >
                          <Droppable droppableId={colKey}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="kanban-droppable"
                              >
                                {col.items.map((item, idx) => (
                                  <Draggable
                                    key={item.title + idx}
                                    draggableId={item.title + colKey + idx}
                                    index={idx}
                                  >
                                    {(provided) => (
                                      <KanbanCard
                                        item={item}
                                        onClick={() => {
                                          if (!item.isNew)
                                            handleCardClick(colKey, item, idx);
                                        }}
                                        provided={provided}
                                        onEdit={(newTitle) =>
                                          handleInlineEdit(colKey, idx, newTitle)
                                        }
                                        isEditing={!!item.isNew}
                                        onRequestAddNewCard={
                                          item.isNew
                                            ? () => handleAddCard(colKey)
                                            : undefined
                                        }
                                      />
                                    )}
                                  </Draggable>
                                ))}
                                {/* New Page card as last row */}
                                <div style={{ width: "100%" }}>
                                  <Card
                                    className="kanban-card kanban-new-page-card"
                                    onClick={() => handleAddCard(colKey)}
                                  >
                                    <Button
                                      label="New Page"
                                      className="p-button-text kanban-new-page"
                                      style={{ width: "100%" }}
                                    />
                                  </Card>
                                </div>
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </KanbanColumn>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
              <div
                style={{ display: "flex", alignItems: "center", height: "100%" }}
              >
                <button
                  onClick={handleAddCol}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                    color: "#888",
                    marginTop: 0,
                  }}
                >
                  + Add section
                </button>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <CardModal
        visible={modalVisible}
        onHide={() => {
          setModalVisible(false);
          setIsAddMode(false);
        }}
        card={selectedCard}
        onSave={handleSaveCard}
        onDelete={handleDeleteCard}
        isAddMode={isAddMode}
      />
    </div>
  );
};

export default KanbanBoard;
