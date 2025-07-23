import React, { useState, useRef, useEffect } from "react";

const KanbanColumn = ({
  colKey,
  col,
  onAddCard,
  onCardClick,
  onEditCol,
  onDeleteCol,
  onAddCol,
  onAddColLeft,
  onAddColRight,
  children,
  autoEdit,
  dragHandleProps,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(col.name);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const menuRef = useRef();
  const submenuTimeout = useRef();
  const inputRef = useRef();

  // Auto-edit when prop is set
  useEffect(() => {
    if (autoEdit) {
      setIsEditing(true);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 0);
    }
  }, [autoEdit]);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setSubmenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleEdit = () => {
    setIsEditing(true);
    setMenuOpen(false);
  };
  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };
  const handleEditBlur = () => {
    setIsEditing(false);
    if (editValue.trim() && editValue !== col.name) {
      onEditCol(colKey, editValue.trim());
    } else {
      setEditValue(col.name);
      if (autoEdit) onEditCol(colKey, col.name); // clear autoEditColKey if cancelled
    }
  };
  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") {
      handleEditBlur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(col.name);
      if (autoEdit) onEditCol(colKey, col.name); // clear autoEditColKey if cancelled
    }
  };

  // Menu actions
  const handleMenuClick = () => setMenuOpen((v) => !v);
  const handleAddColLeft = () => {
    onAddColLeft(colKey);
    setMenuOpen(false);
    setSubmenuOpen(false);
  };
  const handleAddColRight = () => {
    onAddColRight(colKey);
    setMenuOpen(false);
    setSubmenuOpen(false);
  };
  const handleDelete = () => {
    onDeleteCol(colKey);
    setMenuOpen(false);
  };
  const handleAddColMain = () => {
    onAddCol();
    setMenuOpen(false);
    setSubmenuOpen(false);
  };

  // Submenu open/close logic for reliability
  const openSubmenu = () => {
    clearTimeout(submenuTimeout.current);
    setSubmenuOpen(true);
  };
  const closeSubmenu = () => {
    submenuTimeout.current = setTimeout(() => setSubmenuOpen(false), 200);
  };

  return (
    <div className="kanban-column">
      <div
        className="kanban-column-title"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          position: "relative",
        }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            autoFocus
            onChange={handleEditChange}
            onBlur={handleEditBlur}
            onKeyDown={handleEditKeyDown}
            style={{
              fontWeight: 600,
              fontSize: "1.15rem",
              flex: 1,
              minWidth: 0,
            }}
          />
        ) : (
          <span
            style={{
              flex: 1,
              cursor: "pointer",
              fontSize: "1.15rem",
              fontWeight: 600,
            }}
            onClick={handleEdit}
          >
            {col.name}
          </span>
        )}
        <button
          title="Menu"
          onClick={handleMenuClick}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            fontSize: "1.2rem",
          }}
        >
          ⋯
        </button>
        {menuOpen && (
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              zIndex: 10,
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              borderRadius: 6,
              minWidth: 200,
              padding: "0.5rem 0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0.45rem 1.1rem",
                cursor: "pointer",
                fontSize: 15,
              }}
            >
              <span
                className="pi pi-sliders-h"
                style={{ fontSize: 17, opacity: 0.7 }}
              ></span>
              <span style={{ flex: 1 }}>Add rule to section</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0.45rem 1.1rem",
                cursor: "pointer",
                fontSize: 15,
              }}
              onClick={handleEdit}
            >
              <span
                className="pi pi-pencil"
                style={{ fontSize: 17, opacity: 0.7 }}
              ></span>
              <span style={{ flex: 1 }}>Rename section</span>
            </div>
            <div
              style={{ position: "relative" }}
              onMouseEnter={openSubmenu}
              onMouseLeave={closeSubmenu}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0.45rem 1.1rem",
                  cursor: "pointer",
                  fontSize: 15,
                }}
              >
                <span
                  className="pi pi-list"
                  style={{ fontSize: 17, opacity: 0.7 }}
                ></span>
                <span style={{ flex: 1 }}>Add section</span>
                <span
                  className="pi pi-angle-right"
                  style={{ fontSize: 15, marginLeft: 8, opacity: 0.7 }}
                ></span>
              </div>
              {submenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "100%",
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    borderRadius: 6,
                    minWidth: 180,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "0.45rem 1.1rem",
                      cursor: "pointer",
                      fontSize: 15,
                    }}
                    onClick={handleAddColLeft}
                  >
                    <span style={{ fontSize: 15, opacity: 0.7 }}>←</span>
                    <span style={{ flex: 1 }}>Add section to left</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "0.45rem 1.1rem",
                      cursor: "pointer",
                      fontSize: 15,
                    }}
                    onClick={handleAddColRight}
                  >
                    <span style={{ fontSize: 15, opacity: 0.7 }}>→</span>
                    <span style={{ flex: 1 }}>Add section to right</span>
                  </div>
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0.45rem 1.1rem",
                cursor: "pointer",
                color: "#e54848",
                fontWeight: 500,
                fontSize: 15,
              }}
              onClick={handleDelete}
            >
              <span
                className="pi pi-trash"
                style={{ fontSize: 17, color: "#e54848", opacity: 0.85 }}
              ></span>
              <span style={{ flex: 1 }}>Delete section</span>
            </div>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default KanbanColumn;
