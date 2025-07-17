import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

const KanbanCard = ({
  item,
  onClick,
  provided,
  onEdit,
  isEditing: isEditingProp,
  onRequestAddNewCard, // NEW PROP
}) => {
  const [isEditing, setIsEditing] = useState(!!isEditingProp);
  const [editValue, setEditValue] = useState(item.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditingProp) {
      setEditValue(item.title);
      setIsEditing(true);
    }
  }, [isEditingProp, item.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const startEdit = (e) => {
    e.stopPropagation();
    setEditValue(item.title);
    setIsEditing(true);
  };

  const finishEdit = () => {
    setIsEditing(false);
    if (onEdit) {
      onEdit(editValue);
    }
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") {
      finishEdit();
      if (onRequestAddNewCard) {
        onRequestAddNewCard();
      }
    }
  };

  const handleCardClick = (e) => {
    if (!isEditing) {
      onClick();
    }
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <Card
        className="kanban-card"
        style={{ minHeight: "36px", display: "flex", alignItems: "center" }}
        onClick={handleCardClick}
        onDoubleClick={startEdit}
      >
        <div
          className="kanban-card-title"
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              id={`card-input-${item.id}`}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={finishEdit}
              onKeyDown={handleEditKeyDown}
              autoFocus
              style={{
                flex: 1,
                fontSize: "1rem",
                border: "1px solid #d1d5db",
                borderRadius: 4,
                padding: "2px 6px",
              }}
            />
          ) : (
            <>
              <span style={{ flex: 1 }}>{item.title}</span>
              <Button
                icon="pi pi-pencil"
                className="p-button-text p-button-sm card-edit-btn"
                style={{ fontSize: 14, marginLeft: 2, opacity: 0.7 }}
                onClick={startEdit}
                tabIndex={-1}
                aria-label="Edit card title"
              />
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default KanbanCard;
