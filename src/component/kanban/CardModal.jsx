import React, { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";
import "./CardModal.css";

const statusOptions = [
  { label: "Not Started", value: "Not Started" },
  { label: "In Progress", value: "In Progress" },
  { label: "Done", value: "Done" },
];

const CardModal = ({ visible, onHide, card, onSave, onDelete, isAddMode }) => {
  const [title, setTitle] = useState(card?.title || "");
  const [notes, setNotes] = useState(card?.notes || "");
  const [status, setStatus] = useState(card?.status || "Not Started");
  const [type, setType] = useState(card?.type || "Hobbies");
  const [subtasks, setSubtasks] = useState(card?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState("");
  const [isEditingType, setIsEditingType] = useState(false);

  React.useEffect(() => {
    setTitle(card?.title || "");
    setNotes(card?.notes || "");
    setStatus(card?.status || "Not Started");
    setType(card?.type || "Hobbies");
    setSubtasks(card?.subtasks || []);
  }, [card, visible]);

  const handleSave = () => {
    onSave({ ...card, title, notes, status, type, subtasks });
    onHide();
  };

  const handleDelete = () => {
    confirmDialog({
      message: "Are you sure you want to delete this card?",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        onDelete(card);
        onHide();
      },
    });
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { text: newSubtask, done: false }]);
      setNewSubtask("");
    }
  };

  const toggleSubtask = (idx) => {
    setSubtasks(
      subtasks.map((s, i) => (i === idx ? { ...s, done: !s.done } : s))
    );
  };

  const deleteSubtask = (idx) => {
    setSubtasks(subtasks.filter((_, i) => i !== idx));
  };

  return (
    <>
      <Sidebar
        visible={visible}
        position="right"
        onHide={onHide}
        className="notion-sidebar"
        showCloseIcon={true}
        style={{ width: "540px", maxWidth: "100vw", padding: 0 }}
        blockScroll={false}
      >
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h2 className="sidebar-title">
              {isAddMode ? "New page" : title || "Untitled"}
            </h2>
          </div>
          <div className="sidebar-body">
            <div className="info-row">
              <span className="info-label">Status</span>
              <Dropdown
                value={status}
                options={statusOptions}
                onChange={(e) => setStatus(e.value)}
                className="status-dropdown"
              />
            </div>
            <div className="info-row">
              <span className="info-label">Type</span>
              <div className="type-field">
                {isEditingType ? (
                  <InputText
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    onBlur={() => setIsEditingType(false)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && setIsEditingType(false)
                    }
                    autoFocus
                    className="type-input"
                  />
                ) : (
                  <span
                    className="type-display"
                    onClick={() => setIsEditingType(true)}
                  >
                    {type}
                  </span>
                )}
              </div>
            </div>
            <div className="section">
              <label className="section-label">Title</label>
              <InputText
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
                className="title-input"
              />
            </div>
            <div className="section">
              <label className="section-label">Notes</label>
              <InputTextarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add notes..."
                className="notes-input"
              />
            </div>
            <div className="section">
              <label className="section-label">Sub-tasks / Reflections</label>
              <div className="subtask-input-group">
                <InputText
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add sub-task..."
                  onKeyPress={(e) => e.key === "Enter" && addSubtask()}
                />
                <Button icon="pi pi-plus" onClick={addSubtask} />
              </div>
              <ul className="subtask-list">
                {subtasks.map((s, idx) => (
                  <li key={idx} className="subtask-item">
                    <Button
                      icon={s.done ? "pi pi-check-square" : "pi pi-square"}
                      className="p-button-text p-button-sm"
                      onClick={() => toggleSubtask(idx)}
                    />
                    <span className={s.done ? "subtask-done" : "subtask-text"}>
                      {s.text}
                    </span>
                    <Button
                      icon="pi pi-trash"
                      className="p-button-text p-button-danger p-button-sm"
                      onClick={() => deleteSubtask(idx)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="sidebar-footer">
            {!isAddMode && (
              <Button
                label="Delete"
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={handleDelete}
              />
            )}
            <Button
              label="Save"
              icon="pi pi-check"
              onClick={handleSave}
              autoFocus
            />
          </div>
        </div>
      </Sidebar>
      <ConfirmDialog />
    </>
  );
};

export default CardModal;
