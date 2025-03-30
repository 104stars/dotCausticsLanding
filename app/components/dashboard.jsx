"use client";
import { Avatar, AvatarImage  } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Globe,
  Home,
  LayoutDashboard,
  LifeBuoy,
  MoreHorizontal,
  Settings,
  Wallet,
  Box,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";

// Stats Chart Data
const chartData = [
  { date: "Mar", value: 300 },
  { date: "Apr", value: 350 },
  { date: "May", value: 200 },
  { date: "Jun", value: 400 },
  { date: "Jul", value: 300 },
  { date: "Aug", value: 200 },
  { date: "Sep", value: 450 },
  { date: "Oct", value: 500 },
  { date: "Nov", value: 480 },
  { date: "Dec", value: 400 },
  { date: "Jan", value: 350 },
  { date: "Feb", value: 400 },
];

// Vault Table Data
const vaults = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: "$13,643.21",
    daily: "+$213.8",
    balance: "$13,954.04",
    apy: "8.56%",
    state: "Fixed",
    startDate: "05.10.2023",
    liquidity: "high",
  },
  {
    name: "USDT",
    symbol: "USDT",
    price: "$1.00",
    daily: "+$45.1",
    balance: "$3,954.04",
    apy: "5.44%",
    state: "Fixed",
    startDate: "12.03.2023",
    liquidity: "medium",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: "$2,123.87",
    daily: "+$13.5",
    balance: "$3,954.04",
    apy: "4.12%",
    state: "Flexible",
    startDate: "21.01.2023",
    liquidity: "low",
  },
];

function MetricsCard({ title, value, change, chart }) {
  return (
    <Card className="p-4 bg-zinc-900 border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm text-zinc-400">{title}</h3>
        {chart ? <ArrowUpRight className="h-4 w-4 text-zinc-400" /> : null}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-zinc-100">{value}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-sm text-zinc-300">+{change.value}</span>
            <span
              className={`text-sm ${
                change.isPositive ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {change.percentage}
            </span>
          </div>
        </div>
        {chart}
      </div>
    </Card>
  );
}

// StatsChart Component
function StatsChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 shadow-md">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-zinc-400">
                          Value
                        </span>
                        <span className="font-bold text-zinc-200">
                          {payload[0].value}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-zinc-400">
                          Date
                        </span>
                        <span className="font-bold text-zinc-200">
                          {payload[0].payload.date}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#colorValue)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// VaultTable Component
function VaultTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-zinc-800">
          <TableHead className="text-zinc-400">Vault</TableHead>
          <TableHead className="text-zinc-400">Daily</TableHead>
          <TableHead className="text-zinc-400">Balance ↓</TableHead>
          <TableHead className="text-zinc-400">APY ↓</TableHead>
          <TableHead className="text-zinc-400">State</TableHead>
          <TableHead className="text-zinc-400">Start date</TableHead>
          <TableHead className="text-zinc-400">Liquidity</TableHead>
          <TableHead className="text-zinc-400"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vaults.map((vault) => (
          <TableRow key={vault.symbol} className="border-zinc-800">
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage 
                    src={`/${vault.symbol.toLowerCase()}.png`}
                    sizes="fill"
                    alt={vault.name}
                  />
                </Avatar>
                <div>
                  <div className="font-medium text-zinc-200">{vault.name}</div>
                  <div className="text-xs text-zinc-400">{vault.price}</div>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-emerald-500">{vault.daily}</TableCell>
            <TableCell className="text-zinc-200">{vault.balance}</TableCell>
            <TableCell className="text-zinc-200">{vault.apy}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                  vault.state === "Fixed"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {vault.state}
              </span>
            </TableCell>
            <TableCell className="text-zinc-300">{vault.startDate}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-3 rounded-full ${
                      i <
                      (vault.liquidity === "high"
                        ? 3
                        : vault.liquidity === "medium"
                        ? 2
                        : 1)
                        ? "bg-indigo-500"
                        : "bg-zinc-700"
                    }`}
                  />
                ))}
              </div>
            </TableCell>
            <TableCell>
              <MoreHorizontal className="h-4 w-4 text-zinc-400" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-neutral-900 text-zinc-100">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-zinc-800 bg-zinc-900">
          <div className="flex h-16 items-center gap-2 border-b border-zinc-800 px-6">
            <Box className="h-6 w-6 text-white-500" />
            <span className="font-bold">Dashboard</span>
          </div>
          <div className="px-4 py-4">
            <Input
              placeholder="Search"
              className="bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500"
            />
          </div>
          <nav className="space-y-2 px-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-zinc-200 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <LayoutDashboard className="h-4 w-4" />
              Business Analytics
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <BarChart3 className="h-4 w-4" />
              Statistics & Income
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <Globe className="h-4 w-4" />
              Market
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <Home className="h-4 w-4" />
              Funding
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <Wallet className="h-4 w-4" />
              Yield Vaults
              <ChevronDown className="ml-auto h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <LifeBuoy className="h-4 w-4" />
              Support
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </nav>
        </aside>
        <main className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-zinc-100">Overview</h1>
              <div className="text-sm text-zinc-400">
                Feb 13, 2025 - Mar 18, 2025
              </div>
            </div>
            <Button
              variant="fill"
              className="gap-2 border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:border-zinc-600"
            >
              Ethereum Network
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricsCard
              title="Your Balance"
              value="$74,892"
              change={{
                value: "$1,340",
                percentage: "-2.1%",
                isPositive: false,
              }}
            />
            <MetricsCard
              title="Your Deposits"
              value="$54,892"
              change={{
                value: "$1,340",
                percentage: "+13.2%",
                isPositive: true,
              }}
            />
            <MetricsCard
              title="Accrued Yield"
              value="$20,892"
              change={{
                value: "$1,340",
                percentage: "+1.2%",
                isPositive: true,
              }}
            />
          </div>
          <Card className="mt-6 p-6 bg-zinc-900 border-zinc-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-100">
                General Statistics
              </h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                >
                  Today
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                >
                  Last week
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                >
                  Last month
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                >
                  Last 6 month
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                >
                  Year
                </Button>
              </div>
            </div>
            <StatsChart />
          </Card>
          <div className="mt-6">
            <VaultTable />
          </div>
        </main>
      </div>
    </div>
  );
}
