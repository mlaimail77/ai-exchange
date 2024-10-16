"use client";

import { useState, useEffect } from 'react'
import { ChevronDown, ArrowUpDown, Settings, X, Star, Info, Bot, Send, Wallet } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import axios from 'axios'

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

export default function Component() {
  const [fromChain, setFromChain] = useState(chains[0]) // Fantom
  const [toChain, setToChain] = useState(chains[7]) // Base
  const [fromToken, setFromToken] = useState(chains[0]) // FTM (native token)
  const [toToken, setToToken] = useState(tokens[0]) // USDC
  const [showChainSelect, setShowChainSelect] = useState<false | 'from' | 'to'>(false)
  const [showTokenSelect, setShowTokenSelect] = useState<false | 'from' | 'to'>(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [slippage, setSlippage] = useState('1.0')
  const [deadline, setDeadline] = useState('30')
  const [destinationAddress, setDestinationAddress] = useState('')
  const [aiInput, setAIInput] = useState('')
  const [showAIChat, setShowAIChat] = useState(false)
  const [aiConversation, setAIConversation] = useState<{role: 'user' | 'ai', content: string}[]>([])
  const [loading, setLoading] = useState(false)

  // New state for temporary settings
  const [tempSlippage, setTempSlippage] = useState(slippage)
  const [tempDeadline, setTempDeadline] = useState(deadline)

  useEffect(() => {
    // Load saved settings from localStorage when component mounts
    const savedSlippage = localStorage.getItem('slippage')
    const savedDeadline = localStorage.getItem('deadline')
    if (savedSlippage) setSlippage(savedSlippage)
    if (savedDeadline) setDeadline(savedDeadline)
  }, [])

  useEffect(() => {
    // Update temporary settings when showSettings changes
    if (showSettings) {
      setTempSlippage(slippage)
      setTempDeadline(deadline)
    }
  }, [showSettings, slippage, deadline])

  const handleSwap = () => {
    setFromChain(toChain);
    setToChain(fromChain);
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const handleChainSelect = (chain: typeof chains[0]) => {
    if (showChainSelect === 'from') {
      setFromChain(chain);
      setFromToken(chain); // Set native token as default
    } else if (showChainSelect === 'to') {
      setToChain(chain);
    }
    setShowChainSelect(false);
  };

  const handleTokenSelect = (token: typeof tokens[0]) => {
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

  const handleAIInputSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || !aiInput.trim()) return;

    setAIConversation(prev => [...prev, { role: 'user', content: aiInput }]);
    setShowAIChat(true);
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:8000/api/llm', {
        query: aiInput,
        vector: [0.1, 0.2, 0.3] // dummy vector
      });

      setAIConversation(prev => [...prev, { role: 'ai', content: data.llm_response }]);
    } catch (error) {
      console.error('Error calling the LLM API:', error);
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.detail
        ? error.response.data.detail
        : 'Failed to process your request';
      console.error('Detailed error:', errorMessage);
      setAIConversation(prev => [...prev, { role: 'ai', content: errorMessage }]);
    } finally {
      setLoading(false);
      setAIInput('');
    }
  };

  const handleSaveSettings = () => {
    setSlippage(tempSlippage)
    setDeadline(tempDeadline)
    localStorage.setItem('slippage', tempSlippage)
    localStorage.setItem('deadline', tempDeadline)
    setShowSettings(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="mb-6">
          <div className="flex items-center bg-gray-600 rounded-lg p-2">
            <Bot className="text-blue-400 w-6 h-6 mr-2" />
            <input
              type="text"
              className="bg-transparent text-white w-full focus:outline-none"
              placeholder="What would you like to accomplish?"
              value={aiInput}
              onChange={(e) => setAIInput(e.target.value)}
              onKeyPress={handleAIInputSubmit}
            />
            <Send className="text-blue-400 w-5 h-5 ml-2 cursor-pointer" onClick={() => handleAIInputSubmit({ key: 'Enter' } as React.KeyboardEvent<HTMLInputElement>)} />
          </div>
        </div>

        <div className="rounded-3xl bg-gray-800 border border-gray-700 shadow-xl p-6">
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
              <div className="flex justify-between mt-2 text-sm items-center">
                <div className="flex items-center">
                  <Wallet className="text-gray-400 w-4 h-4 mr-1" />
                  <span className="text-gray-400">0</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-400 bg-blue-400/20 px-2 py-1 rounded-md text-xs font-medium hover:bg-blue-400/30 transition-colors">
                    Max
                  </button>
                  <span className="text-gray-400">$0.00</span>
                </div>
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
              <div className="flex justify-between mt-2 text-sm items-center">
                <div className="flex items-center">
                  <Wallet className="text-gray-400 w-4 h-4 mr-1" />
                  <span className="text-gray-400">0</span>
                </div>
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
      </div>

      {/* Chain Select Dialog */}
      <Dialog open={showChainSelect !== false} onOpenChange={(open) => setShowChainSelect(open ? 'from' : false)}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Select chain</DialogTitle>
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
            <DialogTitle>Select token</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Input className="w-full pl-10 bg-gray-700 border-gray-600 text-white" placeholder="Search by name or paste address" />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="w-4  h-4 bg-red-500 rounded-full"></div>
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
            <DialogTitle>Settings</DialogTitle>
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
                    variant={tempSlippage === value ? 'secondary' : 'outline'}
                    className={`flex-1 ${tempSlippage === value ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white' : 'bg-gray-600 text-white hover:bg-gray-700'}`}
                    onClick={() => setTempSlippage(value)}
                  >
                    {value}%
                  </Button>
                ))}
                <div className="flex-1 relative">
                  <Input
                    type="number"
                    value={tempSlippage}
                    onChange={(e) => setTempSlippage(e.target.value)}
                    className="w-full bg-gray-700 border-gray-600 text-white pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="0"
                    step="0.1"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">%</span>
                </div>
              </div>
            </div>
            <div>
              <label className="flex items-center space-x-2 text-sm mb-2">
                <span>Transaction deadline</span>
                <Info className="w-4 h-4 text-gray-400" />
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={tempDeadline}
                  onChange={(e) => setTempDeadline(e.target.value)}
                  className="w-20 bg-gray-700 border-gray-600 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  step="1"
                  min="0"
                />
                <span className="text-gray-400">Minutes</span>
              </div>
            </div>
          </div>
          <Button className="w-full bg-gradient-to-r from-blue-400 to-blue-600" onClick={handleSaveSettings}>Save</Button>
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

      {showAIChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-md">
            <div className="bg-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="text-blue-400 w-6 h-6 mr-2" />
                <h3 className="text-white font-semibold">AI Agent</h3>
              </div>
              <X className="text-gray-400 cursor-pointer" onClick={() => setShowAIChat(false)} />
            </div>
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {aiConversation.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3/4 p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-200'}`}>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-700 p-2">
              <input
                type="text"
                className="w-full bg-gray-600 text-white rounded-lg p-2 focus:outline-none"
                placeholder="Type your message..."
                value={aiInput}
                onChange={(e) => setAIInput(e.target.value)}
                onKeyPress={handleAIInputSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
