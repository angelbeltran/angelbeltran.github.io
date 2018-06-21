import React from 'react'

export default function Block ({ x, y, color }) {
  return <rect x={x} y={y} width="10" height="10" fill={color} />
}

