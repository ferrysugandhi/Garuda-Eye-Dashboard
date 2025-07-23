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
import { Badge } from "@/components/ui/badge"

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

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
  const getNodeStyle = (role: string, riskScore: number) => {
    let backgroundColor = "#3b82f6" // blue for normal
    let size = 60

    if (role === "Bandar Utama") {
      backgroundColor = "#ef4444" // red
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

  const getRoleBadgeColor = (role: string) => {
    if (role === "Bandar Utama") return "bg-red-600"
    if (role === "Mule/Pengepul") return "bg-orange-600"
    return "bg-blue-600"
  }

  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} />
      <div style={getNodeStyle(data.role, data.risk_score)}>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <Badge className={`text-xs ${getRoleBadgeColor(data.role)} text-white`}>{data.role}</Badge>
      </div>
    </div>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

export function NetworkGraph({ nodes, edges, onNodeClick }: NetworkGraphProps) {
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
