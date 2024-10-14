"use client";

import { useState } from 'react'
import { ChevronDown, ArrowUpDown, Settings, X, Star, Info, Route } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const chains = [
  { name: 'Fantom', symbol: 'FTM', color: 'bg-blue-500' },
  { name: 'Ethereum', symbol: 'ETH', color: 'bg-blue-700' },
  { name: 'Avalanche', symbol: 'AVAX', color: 'bg-red-500' },
  { name: 'BNB Chain', symbol: 'BNB', color: 'bg-yellow-500' },
  { name: 'Polygon', symbol: 'MATIC', color: 'bg-purple-500' },
  { name: 'Arbitrum', symbol: 'ARB', color: 'bg-blue-600' },
  { name: 'Optimism', symbol: 'OP', color: 'bg-red-600' },
  { name: 'Base', symbol: 'ETH', color: 'bg-blue-500' },
]

const tokens = [
  { symbol: 'USDC', name: 'USD Coin', color: 'bg-blue-500' },
  { symbol: 'ETH', name: 'Ethereum', color: 'bg-blue-700' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', color: 'bg-orange-500' },
  { symbol: 'USDT', name: 'Tether', color: 'bg-green-500' },
  { symbol: 'DAI', name: 'Dai', color: 'bg-yellow-500' },
]

// Add this interface at the top of your file, after the imports
interface Chain {
  name: string;
  symbol: string;
  color: string;
}

interface Token {
  symbol: string;
  name: string;
  color: string;
}

export default function Component() {
  const [fromChain, setFromChain] = useState(chains[0]) // Fantom
  const [toChain, setToChain] = useState(chains[7]) // Base
  const [fromToken, setFromToken] = useState(chains[0]) // FTM (native token)
  const [toToken, setToToken] = useState(tokens[0]) // USDC
  const [showChainSelect, setShowChainSelect] = useState<false | 'from' | 'to'>(false)
  const [showTokenSelect, setShowTokenSelect] = useState<false | 'from' | 'to'>(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [slippage, setSlippage] = useState('1')
  const [deadline, setDeadline] = useState('30')
  const [destinationAddress, setDestinationAddress] = useState('')

  const handleSwap = () => {
    setFromChain(toChain);
    setToChain(fromChain);
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const handleChainSelect = (chain: Chain) => {
    if (showChainSelect === 'from') {
      setFromChain(chain);
      // Find the native token for this chain
      const nativeToken = tokens.find(token => token.symbol === chain.symbol) || tokens[0];
      setFromToken(nativeToken);
    } else if (showChainSelect === 'to') {
      setToChain(chain);
    }
    setShowChainSelect(false);
  };

  const handleTokenSelect = (token: Token) => {
    if (showTokenSelect === 'from') {
      setFromToken(token);
    } else if (showTokenSelect === 'to') {
      setToToken(token);
    }
    setShowTokenSelect(false);
  };

  const handleConfirmAddress = () => {
    setShowAddAddress(false);
    // The destination address is now stored in the state and can be used elsewhere
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md p-6 rounded-3xl bg-gray-800 border border-gray-700 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <button className="text-gray-400 hover:text-white">
            <Settings onClick={() => setShowSettings(true)} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">From</span>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setShowChainSelect('from')}>
              <div className={`w-6 h-6 ${fromChain.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                {fromChain.symbol[0]}
              </div>
              <span className="text-white">{fromChain.name}</span>
              <ChevronDown className="text-gray-400 w-4 h-4" />
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setShowTokenSelect('from')}>
                <div className={`w-8 h-8 ${fromToken.color} rounded-full flex items-center justify-center text-white font-bold`}>
                  {fromToken.symbol[0]}
                </div>
                <span className="text-white">{fromToken.symbol}</span>
                <ChevronDown className="text-gray-400 w-4 h-4" />
              </div>
              <input className="bg-transparent text-right text-white text-2xl w-1/2 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="0" />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-blue-400">0 Max</span>
              <span className="text-gray-400">$0.00</span>
            </div>
          </div>

          <div className="flex justify-center">
            <button className="bg-gray-700 p-2 rounded-full" onClick={handleSwap}>
              <ArrowUpDown className="text-blue-400" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-400">To</span>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setShowChainSelect('to')}>
              <div className={`w-6 h-6 ${toChain.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                {toChain.symbol[0]}
              </div>
              <span className="text-white">{toChain.name}</span>
              <ChevronDown className="text-gray-400 w-4 h-4" />
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setShowTokenSelect('to')}>
                <div className={`w-8 h-8 ${toToken.color} rounded-full flex items-center justify-center text-white font-bold`}>
                  {toToken.symbol[0]}
                </div>
                <span className="text-white">{toToken.symbol}</span>
                <ChevronDown className="text-gray-400 w-4 h-4" />
              </div>
              <input className="bg-transparent text-right text-white text-2xl w-1/2 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="0" />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-400">0</span>
              <span className="text-gray-400">$0.00</span>
            </div>
            <button className="w-full mt-2 py-2 text-sm text-blue-400 bg-gray-900 rounded-lg" onClick={() => setShowAddAddress(true)}>
              {destinationAddress ? destinationAddress : "+ Add recipient address"}
            </button>
          </div>

          <div className="flex justify-between text-sm text-gray-400">
            <span>1 {fromToken.symbol} = 0.00 {toToken.symbol} ($-)</span>
            <div className="flex items-center space-x-1">
              <span>Fee: -</span>
              <Info className="w-4 h-4" />
            </div>
          </div>

          <button className="w-full py-4 text-lg font-semibold text-white rounded-lg bg-gradient-to-r from-blue-400 to-blue-600">
            SWITCH TO {fromChain.name.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Chain Select Dialog */}
      <Dialog open={showChainSelect !== false} onOpenChange={(open) => setShowChainSelect(open ? 'from' : false)}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Select chain</span>
              <X className="cursor-pointer" onClick={() => setShowChainSelect(false)} />
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input className="w-full bg-gray-700 border-gray-600 text-white" placeholder="Search chains" />
            <div className="space-y-2">
              {chains.map((chain) => (
                <div key={chain.name} className="flex justify-between items-center p-2 hover:bg-gray-700 rounded-lg cursor-pointer" onClick={() => handleChainSelect(chain)}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${chain.color} rounded-full flex items-center justify-center text-white font-bold`}>
                      {chain.symbol[0]}
                    </div>
                    <div>{chain.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Token Select Dialog */}
      <Dialog open={showTokenSelect !== false} onOpenChange={(open) => setShowTokenSelect(open ? 'from' : false)}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Select token</span>
              <X className="cursor-pointer" onClick={() => setShowTokenSelect(false)} />
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Input className="w-full pl-10 bg-gray-700 border-gray-600 text-white" placeholder="Search by name or paste address" />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Star className="text-yellow-500" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {tokens.slice(0, 5).map((token) => (
                <div key={token.symbol} className="bg-gray-700 rounded-full px-3 py-1 text-sm">
                  {token.symbol}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {tokens.map((token) => (
                <div key={token.symbol} className="flex justify-between items-center p-2 hover:bg-gray-700 rounded-lg cursor-pointer" onClick={() => handleTokenSelect(token)}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${token.color} rounded-full flex items-center justify-center text-white font-bold`}>
                      {token.symbol[0]}
                    </div>
                    <div>
                      <div>{token.symbol}</div>
                      <div className="text-sm text-gray-400">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>0</div>
                    <Star className="inline text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Settings</span>
              <X className="cursor-pointer" onClick={() => setShowSettings(false)} />
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2 text-sm mb-2">
                <span>Slippage tolerance</span>
                <Info className="w-4 h-4 text-gray-400" />
              </label>
              <div className="flex space-x-2">
                {['0.5', '1.0', '2.0'].map((value) => (
                  <Button
                    key={value}
                    variant={slippage === value ? 'secondary' : 'outline'}
                    className={`flex-1 ${slippage === value ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white' : ''}`}
                    onClick={() => setSlippage(value)}
                  >
                    {value}%
                  </Button>
                ))}
                <div className="flex-1 relative">
                  <Input
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="pr-8 bg-gradient-to-r from-blue-400 to-blue-600 border-0 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="0"
                    step="0.1"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-white">%</span>
                </div>
              </div>
            </div>
            <div>
              <label className="flex items-center  space-x-2 text-sm mb-2">
                <span>Transaction deadline</span>
                <Info className="w-4 h-4 text-gray-400" />
              </label>
              <div  className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  step="1"
                  min="0"
                />
                <span className="text-gray-400">Minutes</span>
              </div>
            </div>
          </div>
          <Button className="w-full bg-gradient-to-r from-blue-400 to-blue-600">Save</Button>
        </DialogContent>
      </Dialog>

      {/* Add Destination Address Dialog */}
      <Dialog open={showAddAddress} onOpenChange={setShowAddAddress}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Add destination address</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              Fill in and confirm the address to receive the funds on the destination chain.
            </p>
            <p className="text-sm text-yellow-500">
              Please do NOT send funds to an exchange wallet or custodial wallet.
            </p>
            <Input 
              className="bg-gray-700 border-gray-600 text-white" 
              placeholder="0x" 
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1 bg-gray-500 text-white hover:bg-gray-600" 
                onClick={() => setShowAddAddress(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-400 to-blue-600"
                onClick={handleConfirmAddress}
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}