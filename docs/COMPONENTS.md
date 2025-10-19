# 🧩 Component Documentation

## Overview

The Anoma AGI OS is built with a modular component architecture using React, TypeScript, and shadcn/ui components. This documentation covers all major components, their props, usage patterns, and customization options.

## Component Architecture

```
src/app/page.tsx (Main Application)
├── Header Section
├── System Metrics Grid
├── Process Monitor
├── Network Activity
├── Neural Command Center
│   ├── Terminal Tab
│   ├── AI Assistant Tab
│   ├── Security Tab
│   ├── Settings Tab
│   └── File System Tab
└── Status Bar
```

## 🎯 Main Application Component

### AnomaOS

**Location**: `src/app/page.tsx`

The main application component that orchestrates all subsystems and manages global state.

**Key Features**:
- Real-time data fetching and state management
- Tab-based interface navigation
- Responsive layout with grid system
- Integration with all API endpoints

**State Management**:
```typescript
const [currentTime, setCurrentTime] = useState(new Date())
const [systemStatus, setSystemStatus] = useState<'online' | 'offline' | 'maintenance'>('online')
const [aiCoreActive, setAiCoreActive] = useState(true)
const [quantumProcessing, setQuantumProcessing] = useState(false)
const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([])
const [processes, setProcesses] = useState<Process[]>([])
const [networkActivity, setNetworkActivity] = useState<NetworkActivity[]>([])
const [aiMessages, setAiMessages] = useState<AIMessage[]>([])
const [fileSystemItems, setFileSystemItems] = useState<FileSystemItem[]>([])
```

**Data Fetching**:
```typescript
const fetchSystemData = async () => {
  const response = await fetch('/api/system')
  const data = await response.json()
  if (data.success) {
    setSystemMetrics(data.data.metrics)
    setProcesses(data.data.processes)
  }
}
```

---

## 📊 System Monitoring Components

### SystemMetricsCard

**Location**: Integrated in main page

Displays real-time system metrics with progress bars and status indicators.

**Props Interface**:
```typescript
interface SystemMetricsCardProps {
  metrics: SystemMetric[]
}

interface SystemMetric {
  label: string
  value: number
  max: number
  unit: string
  status: 'normal' | 'warning' | 'critical'
}
```

**Features**:
- Animated progress bars
- Color-coded status indicators
- Real-time value updates
- Responsive grid layout

**Usage Example**:
```tsx
<div className="space-y-4">
  {systemMetrics.map((metric, index) => (
    <div key={index} className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-300">{metric.label}</span>
        <span className={`text-sm font-mono ${getStatusColor(metric.status)}`}>
          {metric.value.toFixed(1)}{metric.unit}
        </span>
      </div>
      <Progress 
        value={(metric.value / metric.max) * 100} 
        className="h-2 bg-gray-800"
      />
    </div>
  ))}
</div>
```

### ProcessMonitor

**Location**: Integrated in main page

Displays running processes with CPU and memory usage.

**Props Interface**:
```typescript
interface ProcessMonitorProps {
  processes: Process[]
}

interface Process {
  id: string
  name: string
  cpu: number
  memory: number
  status: 'running' | 'sleeping' | 'stopped'
  priority: 'high' | 'medium' | 'low'
}
```

**Features**:
- Scrollable process list
- Status indicators with color coding
- Priority badges
- Resource usage display

**Usage Example**:
```tsx
<ScrollArea className="h-64">
  <div className="space-y-3">
    {processes.map((process) => (
      <div key={process.id} className="p-3 bg-gray-800 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(process.status)}`} />
            <span className="text-sm font-medium">{process.name}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {process.priority}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
          <div>CPU: {process.cpu.toFixed(1)}%</div>
          <div>Memory: {process.memory.toFixed(1)}GB</div>
        </div>
      </div>
    ))}
  </div>
</ScrollArea>
```

### NetworkActivityMonitor

**Location**: Integrated in main page

Shows network connections and security events.

**Props Interface**:
```typescript
interface NetworkActivityMonitorProps {
  activities: NetworkActivity[]
}

interface NetworkActivity {
  timestamp: string
  source: string
  destination: string
  protocol: string
  status: 'allowed' | 'blocked' | 'monitoring'
}
```

**Features**:
- Real-time activity feed
- Protocol and status display
- Timestamp tracking
- Security event highlighting

---

## 🤖 AI Assistant Components

### AIChatInterface

**Location**: Integrated in AI Assistant tab

Provides chat interface with the neural AI assistant.

**Props Interface**:
```typescript
interface AIChatInterfaceProps {
  messages: AIMessage[]
  onSendMessage: (message: string) => void
  isLoading: boolean
}

interface AIMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: string
}
```

**Features**:
- Message history with scroll
- Real-time typing indicators
- Context-aware responses
- Markdown content rendering

**Usage Example**:
```tsx
<div className="space-y-4">
  <ScrollArea className="h-64 bg-gray-800 rounded-lg p-4">
    <div className="space-y-3">
      {aiMessages.map((message) => (
        <div key={message.id} className={`flex items-start space-x-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
          {message.type === 'assistant' && (
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
          )}
          <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
            <div className={`text-sm ${message.type === 'user' ? 'text-cyan-400' : 'text-purple-400'} bg-gray-900 p-3 rounded-lg`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
              <div className="text-xs text-gray-500 mt-1">{message.timestamp}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </ScrollArea>
</div>
```

---

### 💬 Terminal Component

**Location**: Integrated in Terminal tab

Interactive command-line interface for system control.

**Props Interface**:
```typescript
interface TerminalProps {
  history: string[]
  onCommand: (command: string) => void
  currentInput: string
  onInputChange: (value: string) => void
}
```

**Features**:
- Command history with scroll
- Auto-scroll to latest output
- Command execution feedback
- Custom command processing

**Supported Commands**:
```typescript
const commands = {
  help: 'Show available commands',
  status: 'Display system status',
  processes: 'List running processes',
  network: 'Show network activity',
  quantum: 'Control quantum processor',
  scan: 'Run security scan',
  clear: 'Clear terminal'
}
```

**Usage Example**:
```tsx
<div className="bg-black p-4 rounded-lg font-mono text-sm">
  <ScrollArea className="h-64" ref={terminalRef}>
    <div className="text-green-400 space-y-1">
      {terminalHistory.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
      <div className="flex items-center">
        <span>$ </span>
        <Input
          value={terminalInput}
          onChange={(e) => setTerminalInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              executeTerminalCommand(terminalInput)
            }
          }}
          className="bg-transparent border-none outline-none text-green-400 ml-2 px-0"
          placeholder="Type 'help' for commands..."
        />
      </div>
    </div>
  </ScrollArea>
</div>
```

---

### 🔒 Security Components

### SecurityDashboard

**Location**: Integrated in Security tab

Displays security status, alerts, and system protection.

**Features**:
- Firewall status monitoring
- Intrusion detection alerts
- Recent security events
- System protection status

**Usage Example**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="bg-gray-800 p-4 rounded-lg">
    <div className="flex items-center space-x-2 mb-3">
      <Lock className="w-4 h-4 text-green-400" />
      <span className="text-sm font-medium">Security Status</span>
    </div>
    <div className="space-y-2 text-xs">
      <div className="flex justify-between">
        <span>Firewall</span>
        <span className="text-green-400">Active</span>
      </div>
      <div className="flex justify-between">
        <span>Intrusion Detection</span>
        <span className="text-green-400">Monitoring</span>
      </div>
    </div>
  </div>
</div>
```

---

### 💾 File System Components

### FileSystemExplorer

**Location**: Integrated in File System tab

Interactive file system browser with navigation.

**Props Interface**:
```typescript
interface FileSystemExplorerProps {
  items: FileSystemItem[]
  currentPath: string
  stats: FileSystemStats
  onNavigate: (path: string) => void
  onBack: () => void
  onForward: () => void
  onHome: () => void
}

interface FileSystemItem {
  id: string
  name: string
  type: 'file' | 'directory'
  size: number
  modified: string
  permissions: string
  owner: string
  path: string
}
```

**Features**:
- Directory navigation with history
- Storage usage statistics
- File permissions display
- Interactive file/folder listing

**Navigation Functions**:
```typescript
const navigateToDirectory = (path: string) => {
  const newHistory = navigationHistory.slice(0, historyIndex + 1)
  newHistory.push(path)
  setNavigationHistory(newHistory)
  setHistoryIndex(newHistory.length - 1)
  fetchFileSystemData(path)
}

const navigateBack = () => {
  if (historyIndex > 0) {
    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)
    fetchFileSystemData(navigationHistory[newIndex])
  }
}
```

---

### ⚙️ Settings Components

### SettingsPanel

**Location**: Integrated in Settings tab

System configuration and settings management.

**Configuration Categories**:
- AI Configuration
- Quantum Settings
- Network Configuration

**Usage Example**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div className="bg-gray-800 p-4 rounded-lg">
    <h4 className="text-sm font-medium mb-3">AI Configuration</h4>
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs">Learning Mode</span>
        <Badge className="bg-green-600">Enabled</Badge>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs">Autonomy Level</span>
        <span className="text-xs">85%</span>
      </div>
    </div>
  </div>
</div>
```

---

## 🎨 UI Components (shadcn/ui)

### Used Components

The application uses various shadcn/ui components:

#### Layout Components
- **Card**: Container for content sections
- **Separator**: Visual dividers
- **ScrollArea**: Scrollable content areas

#### Navigation Components
- **Tabs**: Tab-based navigation
- **TabsList**: Tab navigation headers
- **TabsContent**: Tab content panels

#### Form Components
- **Input**: Text input fields
- **Textarea**: Multi-line text input
- **Button**: Interactive buttons

#### Feedback Components
- **Badge**: Status indicators and labels
- **Progress**: Progress bars
- **Alert**: Alert messages

#### Display Components
- **Avatar**: User avatars
- **Tooltip**: Hover tooltips

### Custom Styling

All components are styled with Tailwind CSS classes using a consistent design system:

```css
/* Color Scheme */
--neural-cyan: #00ffff;
--quantum-purple: #8b5cf6;
--matrix-green: #00ff00;
--dark-bg: #000000;
--gray-bg: #111827;
--gray-surface: #1f2937;

/* Typography */
font-mono: 'Fira Code', monospace;
font-sans: 'Inter', sans-serif;

/* Spacing */
p-4: 1rem;
p-6: 1.5rem;
gap-4: 1rem;
gap-6: 1.5rem;
```

---

## 🔄 State Management

### Local State

Components use React hooks for local state management:

```typescript
// Example: AI Assistant state
const [aiMessages, setAiMessages] = useState<AIMessage[]>([])
const [aiInput, setAiInput] = useState('')
const [aiLoading, setAiLoading] = useState(false)
```

### Data Fetching

Custom hooks for API data fetching:

```typescript
const fetchSystemData = async () => {
  try {
    const response = await fetch('/api/system')
    const data = await response.json()
    if (data.success) {
      setSystemMetrics(data.data.metrics)
      setProcesses(data.data.processes)
    }
  } catch (error) {
    console.error('Failed to fetch system data:', error)
  }
}
```

### Real-time Updates

Effect hooks for real-time data updates:

```typescript
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date())
    fetchSystemData()
  }, 5000)

  return () => clearInterval(timer)
}, [])
```

---

## 🎯 Custom Hooks

### useTerminal

Custom hook for terminal functionality:

```typescript
const useTerminal = () => {
  const [history, setHistory] = useState<string[]>([])
  const [currentInput, setCurrentInput] = useState('')

  const executeCommand = (command: string) => {
    // Command execution logic
  }

  return {
    history,
    currentInput,
    setCurrentInput,
    executeCommand
  }
}
```

### useFileSystem

Custom hook for file system operations:

```typescript
const useFileSystem = () => {
  const [items, setItems] = useState<FileSystemItem[]>([])
  const [currentPath, setCurrentPath] = useState('/')
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['/'])

  const navigateTo = (path: string) => {
    // Navigation logic
  }

  return {
    items,
    currentPath,
    navigationHistory,
    navigateTo
  }
}
```

---

## 🧪 Component Testing

### Testing Structure

Components are structured for easy testing:

```typescript
// Example test for SystemMetricsCard
import { render, screen } from '@testing-library/react'
import { SystemMetricsCard } from './SystemMetricsCard'

test('renders system metrics', () => {
  const mockMetrics = [
    { label: 'CPU', value: 50, max: 100, unit: '%', status: 'normal' }
  ]
  
  render(<SystemMetricsCard metrics={mockMetrics} />)
  
  expect(screen.getByText('CPU')).toBeInTheDocument()
  expect(screen.getByText('50%')).toBeInTheDocument()
})
```

---

## 🚀 Performance Optimization

### Memoization

Components use React.memo for performance:

```typescript
const ProcessMonitor = React.memo(({ processes }: ProcessMonitorProps) => {
  // Component implementation
})
```

### Lazy Loading

Heavy components can be lazy loaded:

```typescript
const FileSystemExplorer = lazy(() => import('./FileSystemExplorer'))
```

### Virtual Scrolling

For large lists, implement virtual scrolling:

```typescript
import { FixedSizeList as List } from 'react-window'

const VirtualProcessList = ({ processes }) => (
  <List
    height={400}
    itemCount={processes.length}
    itemSize={60}
    itemData={processes}
  >
    {ProcessItem}
  </List>
)
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Tailwind breakpoints */
sm: 640px   /* Small screens */
md: 768px   /* Medium screens */
lg: 1024px  /* Large screens */
xl: 1280px  /* Extra large screens */
```

### Responsive Patterns

```tsx
{/* Responsive grid */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Content */}
</div>

{/* Responsive navigation */}
<div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
  {/* Navigation items */}
</div>
```

---

## 🔧 Customization

### Theming

Customize colors and styles in `tailwind.config.ts`:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        'neural-cyan': '#00ffff',
        'quantum-purple': '#8b5cf6',
        'matrix-green': '#00ff00'
      }
    }
  }
}
```

### Component Props

All components accept customizable props:

```typescript
interface CustomCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'neural' | 'quantum'
  size?: 'sm' | 'md' | 'lg'
}
```

---

## 📚 Best Practices

1. **TypeScript**: Use strict typing for all props and state
2. **Accessibility**: Include ARIA labels and semantic HTML
3. **Performance**: Use React.memo and useMemo for expensive operations
4. **Error Boundaries**: Wrap components in error boundaries
5. **Testing**: Write unit tests for all components
6. **Documentation**: Document props and usage examples

---

## 🔗 Related Documentation

- [API Documentation](./API.md) - Backend API endpoints
- [Developer Guide](./DEVELOPER.md) - Development setup and workflows
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment instructions