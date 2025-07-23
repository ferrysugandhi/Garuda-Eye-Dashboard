"use client"

import { AlertTriangle, Users, ShieldCheck, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function GarudaEyeDashboard() {
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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Run Analysis</Button>
          </div>
        </div>

        {/* Section 2: KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Detected Criminal Networks */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Jaringan Kriminal Terdeteksi</CardTitle>
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">15 Klaster</div>
            </CardContent>
          </Card>

          {/* Card 2: High-Risk Accounts */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Akun Berisiko Tinggi</CardTitle>
              <Users className="h-6 w-6 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">2,185 Akun</div>
            </CardContent>
          </Card>

          {/* Card 3: Potential Loss Prevented */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Potensi Kerugian Dicegah</CardTitle>
              <ShieldCheck className="h-6 w-6 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">Rp 78 Miliar</div>
            </CardContent>
          </Card>
        </div>

        {/* Section 3: Main Analysis Area */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Left Column: Network Graph Visualization (70%) */}
          <div className="lg:col-span-7">
            <Card className="bg-gray-800 border-gray-700 h-[600px]">
              <CardHeader>
                <CardTitle className="text-xl text-white">Peta Jaringan Transaksi</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden">
                  <img
                    src="https://storage.googleapis.com/generativeai-downloads/images/fe/a8f6e70335e317c2a71f0088812c/garuda-eye-mockup.png"
                    alt="Network Graph Visualization"
                    className="w-full h-full object-cover"
                  />
                </div>
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
                {/* Account Header */}
                <div className="flex items-center gap-3">
                  <span className="text-white font-mono">...xxxx1234</span>
                  <Badge variant="destructive" className="bg-red-600 text-white">
                    Bandar Utama
                  </Badge>
                </div>

                {/* Risk Score Section */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-400">Skor Risiko (AI Confidence)</h3>
                  <Progress value={98} className="h-2" />
                  <div className="text-right text-sm text-red-400">98%</div>
                </div>

                {/* Key Stats */}
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-gray-400">Total Dana Masuk (24 Jam):</span>
                    <br />
                    <span className="text-white font-semibold">Rp 4,2 Miliar</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">Jumlah Koneksi Mencurigakan:</span>
                    <br />
                    <span className="text-white font-semibold">512 Akun</span>
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
                        <TableRow className="border-gray-700">
                          <TableCell className="text-white text-xs">14:32</TableCell>
                          <TableCell className="text-white text-xs">Transfer</TableCell>
                          <TableCell className="text-white text-xs">2.1M</TableCell>
                          <TableCell className="text-white text-xs">xxxx5678</TableCell>
                        </TableRow>
                        <TableRow className="border-gray-700">
                          <TableCell className="text-white text-xs">14:28</TableCell>
                          <TableCell className="text-white text-xs">Deposit</TableCell>
                          <TableCell className="text-white text-xs">850K</TableCell>
                          <TableCell className="text-white text-xs">xxxx9012</TableCell>
                        </TableRow>
                        <TableRow className="border-gray-700">
                          <TableCell className="text-white text-xs">14:15</TableCell>
                          <TableCell className="text-white text-xs">Transfer</TableCell>
                          <TableCell className="text-white text-xs">1.3M</TableCell>
                          <TableCell className="text-white text-xs">xxxx3456</TableCell>
                        </TableRow>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
