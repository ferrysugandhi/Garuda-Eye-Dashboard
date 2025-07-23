"use client"

import { useState } from "react"
import { AlertTriangle, Users, ShieldCheck, Calendar, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { NetworkGraph } from "@/components/NetworkGraph"

interface AnalysisData {
  summary_metrics: {
    detected_networks: number
    high_risk_accounts: number
    potential_loss_prevented: string
    analysis_timestamp: string
  }
  nodes: any[]
  edges: any[]
}

export default function GarudaEyeDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [selectedNode, setSelectedNode] = useState<any>(null)

  const handleRunAnalysis = async () => {
    setIsLoading(true)
    setAnalysisData(null)
    setSelectedNode(null)

    // Simulate processing time
    setTimeout(async () => {
      try {
        const response = await fetch("/analysis_result.json")
        const data = await response.json()
        setAnalysisData(data)
      } catch (error) {
        console.error("Failed to load analysis data:", error)
      } finally {
        setIsLoading(false)
      }
    }, 2000)
  }

  const handleNodeClick = (nodeData: any) => {
    setSelectedNode(nodeData)
  }

  const formatCurrency = (amount: string) => {
    const num = Number.parseInt(amount)
    if (num >= 1000000000) {
      return `Rp ${(num / 1000000000).toFixed(1)} Miliar`
    } else if (num >= 1000000) {
      return `Rp ${(num / 1000000).toFixed(0)} Juta`
    }
    return `Rp ${num.toLocaleString()}`
  }

  const getRelatedTransactions = (nodeId: string) => {
    if (!analysisData) return []
    return analysisData.edges.filter((edge) => edge.source === nodeId || edge.target === nodeId).slice(0, 3)
  }

  const getBandarUtamaNode = () => {
    if (!analysisData) return null
    return analysisData.nodes.find((node) => node.role === "Bandar Utama")
  }

  const getMuleAccountsCount = () => {
    if (!analysisData) return 0
    return analysisData.nodes.filter((node) => node.role === "Mule/Pengepul").length
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter">
      <div className="container mx-auto p-6 space-y-6">
        {/* Section 1: Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Garuda Eye Intelligence Dashboard</h1>
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                  <Calendar className="mr-2 h-4 w-4" />
                  June 1, 2025 - June 30, 2025
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                <div className="p-3 text-sm text-gray-300">Date range picker would be implemented here</div>
              </PopoverContent>
            </Popover>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              onClick={handleRunAnalysis}
              disabled={isLoading}
            >
              {isLoading ? "Analyzing..." : "Run Analysis"}
            </Button>
          </div>
        </div>

        {/* Section 2: KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-32 bg-gray-700" />
                  <Skeleton className="h-6 w-6 bg-gray-700" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24 bg-gray-700" />
                </CardContent>
              </Card>
            ))
          ) : analysisData ? (
            // Actual KPI cards with data
            <>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Jaringan Kriminal Terdeteksi</CardTitle>
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {analysisData.summary_metrics.detected_networks} Klaster
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Akun Berisiko Tinggi</CardTitle>
                  <Users className="h-6 w-6 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {analysisData.summary_metrics.high_risk_accounts.toLocaleString()} Akun
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Potensi Kerugian Dicegah</CardTitle>
                  <ShieldCheck className="h-6 w-6 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    Rp {analysisData.summary_metrics.potential_loss_prevented}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            // Empty state
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 opacity-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Menunggu Analisis</CardTitle>
                  <div className="h-6 w-6 bg-gray-600 rounded" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-500">--</div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* AI Intelligence Summary Card */}
        {analysisData && !isLoading && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-400" />
                AI Intelligence Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">
                Analysis complete. Detected{" "}
                <span className="text-red-400 font-semibold">{analysisData.summary_metrics.detected_networks}</span>{" "}
                distinct criminal networks. The most significant network appears to be operated by{" "}
                <span className="text-red-400 font-semibold">{getBandarUtamaNode()?.label}</span>, which has
                consolidated funds from over{" "}
                <span className="text-orange-400 font-semibold">{getMuleAccountsCount()}</span> mule accounts. Recommend
                immediate investigation into this cluster.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Section 3: Main Analysis Area */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Left Column: Network Graph Visualization (70%) */}
          <div className="lg:col-span-7">
            <Card className="bg-gray-800 border-gray-700 h-[600px]">
              <CardHeader>
                <CardTitle className="text-xl text-white">Peta Jaringan Transaksi</CardTitle>
              </CardHeader>
              <CardContent className="h-full p-2">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
                    <div className="space-y-4 w-full max-w-md">
                      <Skeleton className="h-8 w-48 bg-gray-700 mx-auto" />
                      <div className="grid grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <Skeleton key={i} className="h-16 w-16 rounded-full bg-gray-700 mx-auto" />
                        ))}
                      </div>
                      <Skeleton className="h-4 w-32 bg-gray-700 mx-auto" />
                    </div>
                  </div>
                ) : analysisData ? (
                  <NetworkGraph nodes={analysisData.nodes} edges={analysisData.edges} onNodeClick={handleNodeClick} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
                    <div className="text-center text-gray-400">
                      <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Klik "Run Analysis" untuk memulai</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Investigation Panel (30%) */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-800 border-gray-700 h-[600px]">
              <CardHeader>
                <CardTitle className="text-xl text-white">Detail Investigasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!selectedNode ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                    <Users className="h-16 w-16 mb-4 opacity-50" />
                    <p>Klik akun pada peta untuk melihat detail</p>
                  </div>
                ) : (
                  <>
                    {/* Account Header */}
                    <div className="flex items-center gap-3">
                      <span className="text-white font-mono">{selectedNode.label}</span>
                      <Badge
                        variant="destructive"
                        className={`text-white ${
                          selectedNode.role === "Bandar Utama"
                            ? "bg-red-600"
                            : selectedNode.role === "Mule/Pengepul"
                              ? "bg-orange-600"
                              : "bg-blue-600"
                        }`}
                      >
                        {selectedNode.role}
                      </Badge>
                    </div>

                    {/* Risk Score Section */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-400">Skor Risiko (AI Confidence)</h3>
                      <Progress
                        value={selectedNode.risk_score}
                        className={`h-2 ${selectedNode.risk_score > 90 ? "[&>div]:bg-red-500" : "[&>div]:bg-orange-500"}`}
                      />
                      <div
                        className={`text-right text-sm ${selectedNode.risk_score > 90 ? "text-red-400" : "text-orange-400"}`}
                      >
                        {selectedNode.risk_score}%
                      </div>
                    </div>

                    {/* Key Stats */}
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="text-gray-400">Total Dana Masuk (24 Jam):</span>
                        <br />
                        <span className="text-white font-semibold">{formatCurrency(selectedNode.total_in)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-400">Jumlah Koneksi Mencurigakan:</span>
                        <br />
                        <span className="text-white font-semibold">{selectedNode.suspicious_connections} Akun</span>
                      </div>
                    </div>

                    {/* Transaction History Table */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-400">Riwayat Transaksi Terbaru</h3>
                      <div className="rounded-md border border-gray-700">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-700">
                              <TableHead className="text-gray-400 text-xs">Waktu</TableHead>
                              <TableHead className="text-gray-400 text-xs">Jenis</TableHead>
                              <TableHead className="text-gray-400 text-xs">Jumlah</TableHead>
                              <TableHead className="text-gray-400 text-xs">Dari/Ke</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getRelatedTransactions(selectedNode.id).map((transaction, index) => (
                              <TableRow key={index} className="border-gray-700">
                                <TableCell className="text-white text-xs">{transaction.timestamp}</TableCell>
                                <TableCell className="text-white text-xs">{transaction.type}</TableCell>
                                <TableCell className="text-white text-xs">
                                  {(Number.parseInt(transaction.amount) / 1000000).toFixed(0)}M
                                </TableCell>
                                <TableCell className="text-white text-xs">
                                  {transaction.source === selectedNode.id
                                    ? analysisData?.nodes.find((n) => n.id === transaction.target)?.label
                                    : analysisData?.nodes.find((n) => n.id === transaction.source)?.label}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-700"
                    >
                      Buat Laporan Investigasi
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
