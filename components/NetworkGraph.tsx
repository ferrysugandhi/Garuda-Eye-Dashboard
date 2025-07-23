"use client"

import type React from "react"
import { useCallback, useMemo } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

interface CustomNodeData {
  id: string
  label: string
  role: string
  risk_score: number
  total_in: string
  total_out: string
  suspicious_connections: number
}

interface NetworkGraphProps {
  nodes: any[]
  edges: any[]
  onNodeClick: (node: any) => void
}

// Custom Node Component with role-based styling
const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
  const getNodeStyle = (role: string) => {
    let backgroundColor = "#3b82f6" // blue for Normal
    let size = 60

    if (role === "Bandar Utama") {
      backgroundColor = "#ef4444" // red and larger
      size = 80
    } else if (role === "Mule/Pengepul") {
      backgroundColor = "#f97316" // orange
      size = 70
    }

    return {
      backgroundColor,
      width: size,
      height: size,
      borderRadius: "50%",
      border: selected ? "3px solid #ffffff" : "2px solid #374151",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "12px",
      fontWeight: "bold",
      cursor: "pointer",
      boxShadow: selected ? "0 0 20px rgba(255,255,255,0.5)" : "0 4px 8px rgba(0,0,0,0.3)",
      transition: "all 0.2s ease-in-out",
    }
  }

  return (
    <div>
      <Handle type="target" position={Position.Top} />
      <div style={getNodeStyle(data.role)}>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

export function NetworkGraph({ nodes, edges, onNodeClick }: NetworkGraphProps) {
  // Convert nodes to React Flow format
  const reactFlowNodes: Node[] = useMemo(
    () =>
      nodes.map((node) => ({
        id: node.id,
        type: "custom",
        position: node.position,
        data: node,
      })),
    [nodes],
  )

  // Convert edges to React Flow format
  const reactFlowEdges: Edge[] = useMemo(
    () =>
      edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: true,
        style: { stroke: "#6b7280", strokeWidth: 2 },
        label: `Rp ${(Number.parseInt(edge.amount) / 1000000).toFixed(0)}M`,
        labelStyle: {
          fontSize: "10px",
          fontWeight: "bold",
          fill: "#ffffff",
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: "2px 4px",
          borderRadius: "4px",
        },
      })),
    [edges],
  )

  // Handle node clicks and pass data back to parent
  const onNodeClickHandler = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeClick(node.data)
    },
    [onNodeClick],
  )

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg">
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClickHandler}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#374151" />
        <Controls className="bg-gray-800 border-gray-700" />
        <MiniMap
          className="bg-gray-800 border-gray-700"
          nodeColor={(node) => {
            const role = node.data?.role
            if (role === "Bandar Utama") return "#ef4444"
            if (role === "Mule/Pengepul") return "#f97316"
            return "#3b82f6"
          }}
        />
      </ReactFlow>
    </div>
  )
}
