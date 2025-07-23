"use client"

import { useState, useRef, useEffect } from "react"
import { AlertTriangle, Users, ShieldCheck, Calendar, Brain, Activity } from "lucide-react"
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
  // Step 1: State Management with React hooks
  const [isLoading, setIsLoading] = useState(false)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [loadingStep, setLoadingStep] = useState("")
  const [progress, setProgress] = useState(0)
  const [analysisCount, setAnalysisCount] = useState(0)

  // Audio context for modern sound effects
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }, [])

  // Modern sound effect function
  const playAnalysisSound = () => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Modern tech sound: sweep from 800Hz to 400Hz
    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3)

    // Volume envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

    oscillator.type = "sine"
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.3)
  }

  const playProgressSound = () => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Progress beep: quick 600Hz tone
    oscillator.frequency.setValueAtTime(600, ctx.currentTime)

    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

    oscillator.type = "triangle"
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
  }

  const playCompletionSound = () => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current

    // Success chord: play multiple frequencies
    const frequencies = [523.25, 659.25, 783.99] // C5, E5, G5

    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.setValueAtTime(freq, ctx.currentTime)

      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8)

      oscillator.type = "sine"
      oscillator.start(ctx.currentTime + index * 0.1)
      oscillator.stop(ctx.currentTime + 0.8)
    })
  }

  // Step 2: Implement the "Run Analysis" Workflow - exactly 3 seconds with professional sounds
  const handleRunAnalysis = async () => {
    // Reset state untuk analysis baru
    setIsLoading(true)
    setAnalysisData(null)
    setSelectedNode(null)
    setProgress(0)
    setAnalysisCount((prev) => prev + 1)

    // Play initial analysis sound
    playAnalysisSound()

    // Step 1: Loading data (1 second)
    setLoadingStep(`Memuat dan memproses 10,000,000 transaksi dari database... (Analisis ke-${analysisCount + 1})`)
    setProgress(33)
    playProgressSound()

    setTimeout(() => {
      // Step 2: GNN Analysis (1 second)
      setLoadingStep("Menjalankan analisis Graph Neural Network (GNN) untuk deteksi pola...")
      setProgress(66)
      playProgressSound()

      setTimeout(() => {
        // Step 3: Pattern identification (1 second)
        setLoadingStep("Mengidentifikasi 24 akun terindikasi dalam jaringan kriminal...")
        setProgress(100)
        playProgressSound()

        setTimeout(async () => {
          try {
            // Selalu ambil berkas JSON dari root origin agar aman di semua mode preview/deploy
            const response = await fetch("/api/analysis")
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            const data = await response.json()
            setAnalysisData(data)

            // Play completion sound
            playCompletionSound()
          } catch (error) {
            console.error("Failed to load analysis data:", error)
          } finally {
            setIsLoading(false)
            setLoadingStep("")
            setProgress(0)
          }
        }, 1000)
      }, 1000)
    }, 1000)
  }

  // Step 4: Handle node clicks from the network graph
  const handleNodeClick = (nodeData: any) => {
    setSelectedNode(nodeData)
  }

  // Helper functions for Step 4: Dynamic Investigation Panel
  const formatCurrency = (amount: string) => {
    const num = Number.parseInt(amount)
    if (num >= 1000000000) {
      return `Rp ${(num / 1000000000).toFixed(1)} Miliar`
    } else if (num >= 1000000) {
      return `Rp ${(num / 1000000).toFixed(0)} Juta`
    }
    return `Rp ${num.toLocaleString()}`
  }

  // Step 4: Filter transactions connected to selectedNode.id
  const getRelatedTransactions = (nodeId: string) => {
    if (!analysisData) return []
    return analysisData.edges.filter((edge) => edge.source === nodeId || edge.target === nodeId).slice(0, 5)
  }

  // Step 5: Helper functions for AI Insight Summary
  const getBandarUtamaNodes = () => {
    if (!analysisData) return []
    return analysisData.nodes.filter((node) => node.role === "Bandar Utama")
  }

  const getMuleAccountsCount = () => {
    if (!analysisData) return 0
    return analysisData.nodes.filter((node) => node.role === "Mule/Pengepul").length
  }

  const getNormalAccountsCount = () => {
    if (!analysisData) return 0
    return analysisData.nodes.filter((node) => node.role === "Normal").length
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter">
      <div className="container mx-auto p-4 space-y-4 max-w-7xl">
        {/* Section 1: Header with functional Run Analysis button */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Garuda Eye Intelligence Dashboard</h1>
            {analysisCount > 0 && (
              <p className="text-sm text-gray-400 mt-1">
                Analisis terakhir: #{analysisCount} • {analysisData ? "Berhasil" : "Dalam proses"}
              </p>
            )}
          </div>
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
              className={`bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 flex items-center gap-2 ${
                !analysisData && !isLoading
                  ? "animate-pulse shadow-lg shadow-blue-500/50 ring-2 ring-blue-400/30 ring-offset-2 ring-offset-gray-900"
                  : ""
              }`}
              onClick={handleRunAnalysis}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Activity className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Run Analysis"
              )}
            </Button>
          </div>
        </div>

        {/* Loading Status with enhanced professional styling */}
        {isLoading && (
          <Card className="bg-gray-800 border-gray-700 border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-blue-400 animate-spin" />
                <span className="text-white font-medium">{loadingStep}</span>
              </div>
              <Progress value={progress} className="mt-3 h-2" />
              <div className="text-xs text-gray-400 mt-2 flex justify-between">
                <span>Analisis GNN dalam progress...</span>
                <span className="font-mono">{progress}%</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: KPI Cards with Loading State using Skeleton components */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
            // Loading skeletons while isLoading is true
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
            // KPI Cards visible when analysisData is not null and isLoading is false
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
            // Empty state before analysis
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

        {/* Step 5: AI Intelligence Summary Card with improved data explanation */}
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
                Analisis GNN berhasil memproses{" "}
                <span className="text-blue-400 font-semibold">10,000,000 transaksi</span> dan mengidentifikasi{" "}
                <span className="text-red-400 font-semibold">{analysisData.nodes.length} akun terindikasi</span> yang
                terlibat dalam{" "}
                <span className="text-red-400 font-semibold">{analysisData.summary_metrics.detected_networks}</span>{" "}
                jaringan kriminal berbeda. Dari analisis mendalam, terdeteksi{" "}
                <span className="text-red-400 font-semibold">{getBandarUtamaNodes().length}</span> bandar utama yang
                mengoperasikan <span className="text-orange-400 font-semibold">{getMuleAccountsCount()}</span> akun mule
                dan melibatkan <span className="text-blue-400 font-semibold">{getNormalAccountsCount()}</span> akun
                normal dengan{" "}
                <span className="text-yellow-400 font-semibold">{analysisData.edges.length} koneksi mencurigakan</span>.
                Rekomendasi investigasi segera pada klaster dengan tingkat risiko tertinggi.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Section 3: Main Analysis Area */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          {/* Left Column: Network Graph Visualization (70%) */}
          <div className="lg:col-span-7">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-white">Peta Jaringan Transaksi</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="h-[500px] w-full">
                  {isLoading ? (
                    // Step 2: Replace Graph Visualization with Skeleton during loading
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
                      <div className="space-y-4 w-full max-w-md">
                        <Skeleton className="h-8 w-48 bg-gray-700 mx-auto" />
                        <div className="grid grid-cols-4 gap-4">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-12 rounded-full bg-gray-700 mx-auto" />
                          ))}
                        </div>
                        <Skeleton className="h-4 w-40 bg-gray-700 mx-auto" />
                      </div>
                    </div>
                  ) : analysisData ? (
                    // Step 3: Live React Flow component with nodes, edges, and onNodeClick
                    <NetworkGraph nodes={analysisData.nodes} edges={analysisData.edges} onNodeClick={handleNodeClick} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
                      <div className="text-center text-gray-400">
                        <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Klik "Run Analysis" untuk memulai</p>
                        <p className="text-sm mt-2">Analisis GNN pada 10M+ transaksi</p>
                        <div className="mt-4 flex items-center justify-center">
                          <div className="animate-bounce text-blue-400">
                            ↗ Klik tombol "Run Analysis" di kanan atas untuk mulai analisis
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 4: Dynamic Investigation Panel */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-white">Detail Investigasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-[500px] overflow-y-auto">
                  {!selectedNode ? (
                    // Display message when selectedNode is null
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                      <Users className="h-16 w-16 mb-4 opacity-50" />
                      <p>Klik akun pada peta untuk melihat detail</p>

                      <div className="mt-4 animate-pulse text-orange-400 text-sm">
                        💡 Tip: Klik node berwarna merah, oranye, atau biru untuk investigasi mendalam per akun
                      </div>
                    </div>
                  ) : (
                    // Dynamic content when selectedNode has data
                    <div className="space-y-4">
                      {/* Account ID: selectedNode.id */}
                      <div className="flex items-center gap-3">
                        <span className="text-white font-mono">{selectedNode.label}</span>
                        {/* Role Badge: color and text based on selectedNode.role */}
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

                      {/* Risk Score Progress Bar: value = selectedNode.risk_score, red if > 90 */}
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

                      {/* Key Stats: selectedNode.total_in, selectedNode.total_out, etc. */}
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

                      {/* Transaction Table: filtered analysisData.edges connected to selectedNode.id */}
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

                      <Button
                        variant="outline"
                        className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-700"
                      >
                        Buat Laporan Investigasi
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
