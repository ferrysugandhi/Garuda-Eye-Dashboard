"use client"

import type React from "react"
import { useCallback, useMemo } from "react"
import { ReactFlow, Background, Controls, type Node, type Edge, type NodeProps, Handle, Position } from "@xyflow/react"
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
    let size = 40

    if (role === "Bandar Utama") {
      backgroundColor = "#ef4444" // red and larger
      size = 70
    } else if (role === "Mule/Pengepul") {
      backgroundColor = "#f97316" // orange
      size = 55
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
      fontSize: role === "Normal" ? "8px" : "10px",
      fontWeight: "bold",
      cursor: "pointer",
      boxShadow: selected
        ? "0 0 20px rgba(255,255,255,0.5)"
        : "0 4px 8px rgba(0,0,0,0.3), 0 0 15px rgba(59, 130, 246, 0.3)",
      transition: "all 0.2s ease-in-out",
      animation: selected ? "none" : "pulse 2s infinite",
    }
  }

  return (
    <div>
      <Handle type="target" position={Position.Top} />
      <div style={getNodeStyle(data.role)}>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 0 15px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 0 25px rgba(59, 130, 246, 0.6);
          }
        }
      `}</style>
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

  // Convert edges to React Flow format with smaller font labels
  const reactFlowEdges: Edge[] = useMemo(
    () =>
      edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: true,
        style: { stroke: "#6b7280", strokeWidth: 1.5 },
        label: `${edge.type}: ${(Number.parseInt(edge.amount) / 1000000).toFixed(0)}M`,
        labelStyle: {
          fontSize: "7px",
          fontWeight: "500",
          fill: "#ffffff",
          backgroundColor: "rgba(17, 24, 39, 0.85)",
          padding: "1px 3px",
          borderRadius: "3px",
          border: "1px solid rgba(75, 85, 99, 0.3)",
        },
        labelBgPadding: [3, 1],
        labelBgBorderRadius: 3,
        labelBgStyle: {
          fill: "rgba(17, 24, 39, 0.85)",
          stroke: "rgba(75, 85, 99, 0.3)",
          strokeWidth: 1,
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

  // Count nodes by role
  const bandarUtamaCount = nodes.filter((node) => node.role === "Bandar Utama").length
  const muleCount = nodes.filter((node) => node.role === "Mule/Pengepul").length
  const normalCount = nodes.filter((node) => node.role === "Normal").length

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg relative">
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClickHandler}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#374151" />
        <Controls
          className="bg-gray-800 border-gray-700 [&>button]:bg-gray-700 [&>button]:border-gray-600 [&>button]:text-white [&>button]:hover:bg-gray-600"
          showZoom={true}
          showFitView={true}
          showInteractive={true}
        />
      </ReactFlow>

      {/* Legend/Info Panel - Compact and smaller */}
      <div className="absolute bottom-2 right-2 bg-gray-800/90 backdrop-blur-sm border border-gray-600 rounded-md p-2 text-xs text-white shadow-lg max-w-[160px]">
        <h4 className="font-semibold mb-2 text-gray-200 text-xs border-b border-gray-600 pb-1">Legenda</h4>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
              <span className="text-gray-200 text-xs">Bandar Utama</span>
            </div>
            <span className="text-gray-400 font-mono text-xs">{bandarUtamaCount}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm"></div>
              <span className="text-gray-200 text-xs">Mule/Pengepul</span>
            </div>
            <span className="text-gray-400 font-mono text-xs">{muleCount}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm"></div>
              <span className="text-gray-200 text-xs">Normal</span>
            </div>
            <span className="text-gray-400 font-mono text-xs">{normalCount}</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-600 space-y-0.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Total:</span>
            <span className="text-white font-semibold">{nodes.length}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Koneksi:</span>
            <span className="text-white font-semibold">{edges.length}</span>
          </div>
          <div className="text-yellow-400 text-xs">💡 Klik node</div>
        </div>
      </div>
    </div>
  )
}
