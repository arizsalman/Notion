import React from 'react';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { ScrollPanel } from 'primereact/scrollpanel';
import './SubconsciousProfile.css';

const boardData = [
  {
    title: 'Remember',
    items: ['Life lessons']
  },
  {
    title: 'Goals',
    items: ['Spiritual', 'Social', 'Health']
  },
  {
    title: 'Grateful for',
    items: ['Person', 'Things you own', 'Internet']
  },
  {
    title: 'Habits to Add',
    items: ['Gym', 'Reading']
  },
  {
    title: 'Habits to stop',
    items: ['Smoking']
  },
  {
    title: 'Personal Tools',
    items: []
  },
  {
    title: 'Professional Tools',
    items: []
  },
  {
    title: 'Health',
    items: ['CBC', 'HBV']
  },
  {
    title: 'Themes',
    items: []
  },
  {
    title: 'Hobbies',
    items: ['Movies']
  }
];

const SubconsciousProfile = () => {
  return (
    <div className="subconscious-board">
      <h2>Subconscious Profile</h2>
      <div className="board-columns">
        {boardData.map((col, idx) => (
          <div className="board-column" key={idx}>
            <Card title={col.title} className="board-card">
              {col.items.map((item, i) => (
                <div className="card-item" key={i}>{item}</div>
              ))}
              <div className="new-page">New page</div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubconsciousProfile; 