import React from 'react';

export function SortIcon({ direction }) {
  return direction === 'asc' ? (
    <span style={{ marginLeft: 4 }}>▲</span>
  ) : direction === 'desc' ? (
    <span style={{ marginLeft: 4 }}>▼</span>
  ) : null;
}
