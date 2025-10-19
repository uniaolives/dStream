# 👨‍💻 Developer Guide

## Overview

This developer guide provides comprehensive information for contributing to the Anoma AGI Operating System, including development setup, coding standards, testing procedures, and contribution guidelines.

## Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Project Structure](#project-structure)
3. [Coding Standards](#coding-standards)
4. [Development Workflow](#development-workflow)
5. [Testing](#testing)
6. [Debugging](#debugging)
7. [Performance Optimization](#performance-optimization)
8. [Contributing Guidelines](#contributing-guidelines)
9. [Advanced Topics](#advanced-topics)

## Development Environment Setup

### Prerequisites

**Required Software**:
- Node.js 18.0+ (recommended 20.0+)
- npm 8.0+ or yarn 1.22+
- Git 2.30+
- VS Code or preferred IDE

**Recommended VS Code Extensions**:
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### Initial Setup

1. **Clone the Repository**
```bash
git clone <repository-url>
cd anoma-agi-os
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="development-secret-key"
ZAI_API_KEY="your-api-key"
```

4. **Database Setup**
```bash
# Initialize database
npm run db:push

# Generate Prisma client
npm run db:generate
```

5. **Start Development Server**
```bash
npm run dev
```

### Development Tools Configuration

#### ESLint Configuration

`.eslintrc.json`:
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

#### Prettier Configuration

`.prettierrc`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

#### VS Code Settings

`.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Project Structure

### Directory Overview

```
anoma-agi-os/
├── docs/                          # Documentation
│   ├── API.md                     # API documentation
│   ├── ARCHITECTURE.md            # System architecture
│   ├── COMPONENTS.md              # Component reference
│   ├── DEPLOYMENT.md              # Deployment guide
│   ├── DEVELOPER.md               # Developer guide (this file)
│   └── USER_MANUAL.md             # User manual
├── prisma/                        # Database schema and migrations
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Database migrations
├── public/                        # Static assets
│   ├── agi-icon.png               # Application icon
│   ├── agi-os-hero.png            # Hero image
│   └── favicon.ico                # Favicon
├── src/                           # Source code
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # API routes
│   │   │   ├── ai-assistant/      # AI assistant endpoint
│   │   │   ├── filesystem/        # File system API
│   │   │   ├── network/           # Network monitoring API
│   │   │   └── system/            # System metrics API
│   │   ├── globals.css            # Global styles
│   │   ├── layout.tsx             # Root layout component
│   │   └── page.tsx               # Main application page
│   ├── components/                # Reusable components
│   │   └── ui/                    # shadcn/ui components
│   ├── hooks/                     # Custom React hooks
│   │   ├── use-mobile.ts          # Mobile detection hook
│   │   └── use-toast.ts           # Toast notification hook
│   └── lib/                       # Utilities and configurations
│       ├── db.ts                  # Database client
│       ├── socket.ts              # Socket.io configuration
│       └── utils.ts               # Helper functions
├── .env.example                   # Environment template
├── .eslintrc.json                 # ESLint configuration
├── .gitignore                     # Git ignore rules
├── components.json                # shadcn/ui configuration
├── next.config.ts                 # Next.js configuration
├── package.json                   # Dependencies and scripts
├── tailwind.config.ts             # Tailwind CSS configuration
└── tsconfig.json                  # TypeScript configuration
```

### Key Files Explained

#### `src/app/page.tsx`
Main application component containing the entire AGI OS interface.

#### `src/app/api/`
API routes for backend functionality:
- `system/`: System metrics and process monitoring
- `ai-assistant/`: AI chat functionality
- `network/`: Network activity monitoring
- `filesystem/`: File system operations

#### `prisma/schema.prisma`
Database schema definition for data persistence.

#### `src/lib/`
Utility functions and configurations:
- `db.ts`: Prisma database client
- `socket.ts`: WebSocket configuration
- `utils.ts`: Shared helper functions

## Coding Standards

### TypeScript Standards

#### Type Definitions

Always use TypeScript interfaces for type safety:

```typescript
// Good
interface SystemMetric {
  label: string
  value: number
  max: number
  unit: string
  status: 'normal' | 'warning' | 'critical'
}

// Avoid
const systemMetric = {
  label: '',
  value: 0,
  max: 100,
  unit: '%',
  status: 'normal'
}
```

#### Function Signatures

Use explicit return types and parameter types:

```typescript
// Good
const fetchSystemData = async (): Promise<SystemData> => {
  const response = await fetch('/api/system')
  return response.json()
}

// Avoid
const fetchSystemData = async () => {
  const response = await fetch('/api/system')
  return response.json()
}
```

#### Generic Types

Use generics for reusable components:

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}

const useApi = <T>(url: string): UseApiResult<T> => {
  // Implementation
}
```

### React Component Standards

#### Functional Components

Use functional components with hooks:

```typescript
// Good
interface SystemMetricsCardProps {
  metrics: SystemMetric[]
  className?: string
}

const SystemMetricsCard: React.FC<SystemMetricsCardProps> = ({ 
  metrics, 
  className 
}) => {
  return (
    <Card className={className}>
      {/* Component content */}
    </Card>
  )
}

export default SystemMetricsCard
```

#### Props Destructuring

Destructure props for cleaner code:

```typescript
// Good
const ProcessMonitor = ({ processes, onProcessClick }: ProcessMonitorProps) => {
  return (
    <div>
      {processes.map(process => (
        <ProcessItem 
          key={process.id}
          name={process.name}
          cpu={process.cpu}
          memory={process.memory}
          onClick={() => onProcessClick(process.id)}
        />
      ))}
    </div>
  )
}

// Avoid
const ProcessMonitor = (props) => {
  return (
    <div>
      {props.processes.map(process => (
        <ProcessItem 
          key={process.id}
          name={process.name}
          cpu={process.cpu}
          memory={process.memory}
          onClick={() => props.onProcessClick(process.id)}
        />
      ))}
    </div>
  )
}
```

#### Custom Hooks

Create reusable custom hooks:

```typescript
// Good
const useSystemMonitor = (interval: number = 5000) => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/system')
        const data = await response.json()
        setMetrics(data.data.metrics)
      } catch (error) {
        console.error('Failed to fetch metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    const intervalId = setInterval(fetchMetrics, interval)

    return () => clearInterval(intervalId)
  }, [interval])

  return { metrics, loading }
}
```

### CSS and Styling Standards

#### Tailwind CSS Classes

Use consistent Tailwind class ordering:

```typescript
// Good - spacing, layout, typography, colors
<div className="flex items-center justify-between p-4 bg-gray-900 border border-cyan-800 rounded-lg">
  <h2 className="text-lg font-semibold text-cyan-400">System Status</h2>
  <Badge className="bg-green-600">Online</Badge>
</div>

// Avoid - inconsistent ordering
<div className="bg-gray-900 flex p-4 justify-between items-center border-cyan-800 border rounded-lg">
  <h2 className="text-cyan-400 text-lg font-semibold">System Status</h2>
  <Badge className="bg-green-600">Online</Badge>
</div>
```

#### Responsive Design

Use mobile-first responsive design:

```typescript
// Good
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>

// Avoid
<div className="grid grid-cols-3 gap-4 md:grid-cols-2 lg:grid-cols-1">
  {/* Content */}
</div>
```

### API Standards

#### Route Structure

Follow RESTful conventions:

```typescript
// Good
GET    /api/system          // Get system metrics
POST   /api/ai-assistant    // Send AI message
GET    /api/filesystem      // Get file system data
GET    /api/network         // Get network activity

// Avoid
GET    /api/getSystem
POST   /api/aiAssistant/sendMessage
GET    /api/getFileSystem
```

#### Response Format

Use consistent response structure:

```typescript
// Good
export async function GET() {
  try {
    const data = await fetchSystemData()
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch system data',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
```

#### Input Validation

Use Zod for input validation:

```typescript
// Good
import { z } from 'zod'

const AIRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  context: z.object({
    systemStatus: z.string().optional(),
    metrics: z.array(z.any()).optional()
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = AIRequestSchema.parse(body)
    
    // Process validated data
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid input data'
    }, { status: 400 })
  }
}
```

## Development Workflow

### Git Workflow

#### Branch Strategy

Use Git Flow branching model:

```
main                 # Production-ready code
├── develop          # Integration branch
├── feature/ai-chat  # Feature branches
├── feature/ui-update
└── hotfix/security-patch  # Hotfixes
```

#### Commit Message Format

Use conventional commits:

```bash
# Feature
git commit -m "feat(ai): add real-time chat functionality"

# Bug fix
git commit -m "fix(terminal): resolve command parsing issue"

# Documentation
git commit -m "docs(api): update endpoint documentation"

# Style
git commit -m "style(ui): improve button hover effects"

# Refactor
git commit -m "refactor(components): extract common logic to hooks"
```

#### Pull Request Process

1. **Create Feature Branch**
```bash
git checkout -b feature/new-feature
```

2. **Make Changes and Commit**
```bash
git add .
git commit -m "feat: add new feature"
```

3. **Push and Create PR**
```bash
git push origin feature/new-feature
# Create pull request on GitHub/GitLab
```

4. **PR Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

### Development Scripts

#### Available Scripts

```json
{
  "scripts": {
    "dev": "nodemon --exec \"npx tsx server.ts\" --watch server.ts --watch src --ext ts,tsx,js,jsx 2>&1 | tee dev.log",
    "build": "next build",
    "start": "NODE_ENV=production tsx server.ts 2>&1 | tee server.log",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:reset": "prisma migrate reset",
    "db:studio": "prisma studio",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

#### Development Commands

```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check

# Database operations
npm run db:push      # Push schema changes
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio

# Testing
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
```

## Testing

### Testing Strategy

#### Unit Testing

Use Jest and React Testing Library for unit tests:

```typescript
// __tests__/components/SystemMetricsCard.test.tsx
import { render, screen } from '@testing-library/react'
import { SystemMetricsCard } from '@/components/SystemMetricsCard'

describe('SystemMetricsCard', () => {
  const mockMetrics = [
    {
      label: 'CPU Usage',
      value: 45,
      max: 100,
      unit: '%',
      status: 'normal' as const
    }
  ]

  it('renders system metrics correctly', () => {
    render(<SystemMetricsCard metrics={mockMetrics} />)
    
    expect(screen.getByText('CPU Usage')).toBeInTheDocument()
    expect(screen.getByText('45%')).toBeInTheDocument()
  })

  it('displays correct status color', () => {
    render(<SystemMetricsCard metrics={mockMetrics} />)
    
    const statusElement = screen.getByText('45%')
    expect(statusElement).toHaveClass('text-green-500')
  })
})
```

#### Integration Testing

Test API endpoints:

```typescript
// __tests__/api/system.test.ts
import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/system/route'

describe('/api/system', () => {
  it('returns system metrics', async () => {
    const { req, res } = createMocks({ method: 'GET' })
    
    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data.success).toBe(true)
    expect(data.data.metrics).toBeDefined()
  })
})
```

#### E2E Testing

Use Playwright for end-to-end tests:

```typescript
// e2e/system.spec.ts
import { test, expect } from '@playwright/test'

test('system dashboard loads correctly', async ({ page }) => {
  await page.goto('/')
  
  // Check main elements
  await expect(page.locator('h1')).toContainText('Anoma AGI OS')
  await expect(page.locator('[data-testid="system-metrics"]')).toBeVisible()
  await expect(page.locator('[data-testid="process-monitor"]')).toBeVisible()
})

test('ai assistant accepts messages', async ({ page }) => {
  await page.goto('/')
  
  // Navigate to AI assistant
  await page.click('[data-testid="ai-assistant-tab"]')
  
  // Send message
  await page.fill('[data-testid="ai-input"]', 'Hello, AI!')
  await page.click('[data-testid="ai-send-button"]')
  
  // Check response
  await expect(page.locator('[data-testid="ai-response"]')).toBeVisible()
})
```

### Test Configuration

#### Jest Configuration

`jest.config.js`:
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
```

#### Test Setup

`jest.setup.js`:
```javascript
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
}))

// Mock fetch
global.fetch = jest.fn()
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- SystemMetricsCard.test.tsx
```

## Debugging

### Frontend Debugging

#### React DevTools

Install React DevTools browser extension for component inspection.

#### Console Debugging

Use console logging effectively:

```typescript
// Good - structured logging
console.log('System metrics fetched:', { 
  count: metrics.length, 
  timestamp: new Date().toISOString() 
})

// Better - use debug library
import debug from 'debug'
const log = debug('agi:system')

log('Fetching system metrics')
log('Metrics received:', metrics)
```

#### Error Boundaries

Implement error boundaries for better error handling:

```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}
```

### Backend Debugging

#### API Debugging

Use proper error handling and logging:

```typescript
export async function GET() {
  try {
    console.log('Fetching system data...')
    const data = await fetchSystemData()
    console.log('System data fetched successfully:', { 
      metricsCount: data.metrics.length 
    })
    
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to fetch system data:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch system data',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
```

#### Database Debugging

Use Prisma query logging:

```typescript
// Enable query logging in development
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
  ],
})

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})
```

### Performance Debugging

#### React Performance

Use React Profiler:

```typescript
import { Profiler } from 'react'

const onRenderCallback = (id, phase, actualDuration) => {
  console.log('Component render:', { id, phase, actualDuration })
}

<Profiler id="SystemDashboard" onRender={onRenderCallback}>
  <SystemDashboard />
</Profiler>
```

#### Network Performance

Monitor API performance:

```typescript
const fetchWithTiming = async (url: string) => {
  const start = performance.now()
  const response = await fetch(url)
  const end = performance.now()
  
  console.log(`API call to ${url} took ${end - start} milliseconds`)
  return response
}
```

## Performance Optimization

### Frontend Optimization

#### Code Splitting

Use dynamic imports for large components:

```typescript
import dynamic from 'next/dynamic'

const FileSystemExplorer = dynamic(
  () => import('@/components/FileSystemExplorer'),
  { 
    loading: () => <div>Loading file system...</div>,
    ssr: false 
  }
)
```

#### Memoization

Use React.memo and useMemo:

```typescript
const ProcessItem = React.memo(({ process, onClick }: ProcessItemProps) => {
  return (
    <div onClick={() => onClick(process.id)}>
      {process.name}
    </div>
  )
})

const expensiveCalculation = useMemo(() => {
  return processes.reduce((acc, process) => acc + process.cpu, 0)
}, [processes])
```

#### Image Optimization

Use Next.js Image component:

```typescript
import Image from 'next/image'

<Image
  src="/agi-icon.png"
  alt="AGI OS Icon"
  width={64}
  height={64}
  priority
/>
```

### Backend Optimization

#### Caching

Implement API response caching:

```typescript
import { NextRequest, NextResponse } from 'next/server'

const cache = new Map()

export async function GET(request: NextRequest) {
  const cacheKey = 'system-metrics'
  const cached = cache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < 5000) {
    return NextResponse.json(cached.data)
  }
  
  const data = await fetchSystemMetrics()
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  })
  
  return NextResponse.json(data)
}
```

#### Database Optimization

Use efficient queries:

```typescript
// Good - select only needed fields
const processes = await prisma.process.findMany({
  select: {
    id: true,
    name: true,
    cpu: true,
    memory: true,
    status: true
  },
  where: {
    status: 'running'
  },
  orderBy: {
    cpu: 'desc'
  },
  take: 10
})

// Avoid - selecting all fields
const processes = await prisma.process.findMany()
```

### Bundle Optimization

#### Bundle Analysis

Use webpack-bundle-analyzer:

```bash
npm install --save-dev @next/bundle-analyzer
```

`next.config.ts`:
```typescript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // Next.js config
})
```

#### Tree Shaking

Ensure proper imports:

```typescript
// Good - import specific components
import { Button, Card } from '@/components/ui'

// Avoid - import entire library
import * as UI from '@/components/ui'
```

## Contributing Guidelines

### Code Review Process

#### Review Checklist

- [ ] Code follows project style guidelines
- [ ] TypeScript types are properly defined
- [ ] Components are reusable and testable
- [ ] API endpoints have proper error handling
- [ ] Tests are included for new functionality
- [ ] Documentation is updated
- [ ] Performance implications are considered
- [ ] Security implications are considered

#### Review Guidelines

1. **Be Constructive**: Provide helpful, specific feedback
2. **Be Thorough**: Check for bugs, performance issues, and edge cases
3. **Be Respectful**: Maintain professional and positive communication
4. **Be Responsive**: Address review comments promptly

### Release Process

#### Version Management

Use semantic versioning:

- **Major**: Breaking changes (2.0.0)
- **Minor**: New features (1.1.0)
- **Patch**: Bug fixes (1.0.1)

#### Release Checklist

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] CHANGELOG is updated
- [ ] Version is bumped
- [ ] Git tag is created
- [ ] Release is deployed

### Community Guidelines

#### Code of Conduct

1. **Be Inclusive**: Respect all perspectives and experiences
2. **Be Collaborative**: Work together to achieve common goals
3. **Be Helpful**: Support others in their learning and development
4. **Be Respectful**: Value different opinions and approaches

#### Getting Help

1. **Documentation**: Check existing documentation first
2. **Issues**: Search existing GitHub issues
3. **Discussions**: Use GitHub Discussions for questions
4. **Discord**: Join community Discord for real-time help

## Advanced Topics

### Advanced React Patterns

#### Custom Hooks with Context

```typescript
// Create context
const SystemContext = createContext<SystemContextType | null>(null)

// Provider component
export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [system, setSystem] = useState<SystemState>()
  
  return (
    <SystemContext.Provider value={{ system, setSystem }}>
      {children}
    </SystemContext.Provider>
  )
}

// Custom hook
export const useSystem = () => {
  const context = useContext(SystemContext)
  if (!context) {
    throw new Error('useSystem must be used within SystemProvider')
  }
  return context
}
```

#### Render Props Pattern

```typescript
interface DataFetcherProps<T> {
  url: string
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    setLoading(true)
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [url])
  
  return <>{children(data, loading, error)}</>
}

// Usage
<DataFetcher<SystemData> url="/api/system">
  {(data, loading, error) => {
    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>
    if (data) return <SystemDashboard data={data} />
    return null
  }}
</DataFetcher>
```

### Advanced API Patterns

#### WebSocket Integration

```typescript
// lib/websocket.ts
import { io, Socket } from 'socket.io-client'

class WebSocketService {
  private socket: Socket | null = null
  
  connect() {
    this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000')
    
    this.socket.on('system-metrics', (data) => {
      // Handle real-time updates
    })
    
    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
    })
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
  
  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }
}

export const wsService = new WebSocketService()
```

#### GraphQL Integration (Optional)

```typescript
// lib/graphql.ts
import { GraphQLClient } from 'graphql-request'

const client = new GraphQLClient(process.env.GRAPHQL_URL || 'http://localhost:3000/graphql')

export const gql = (template: TemplateStringsArray, ...args: any[]) => {
  return template.reduce((acc, str, i) => acc + str + (args[i] || ''), '')
}

export const query = async <T = any>(query: string, variables?: any): Promise<T> => {
  return client.request(query, variables)
}
```

### Advanced State Management

#### Zustand Store

```typescript
// stores/systemStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface SystemState {
  metrics: SystemMetric[]
  processes: Process[]
  status: 'online' | 'offline' | 'maintenance'
  setMetrics: (metrics: SystemMetric[]) => void
  setProcesses: (processes: Process[]) => void
  setStatus: (status: SystemState['status']) => void
  fetchSystemData: () => Promise<void>
}

export const useSystemStore = create<SystemState>()(
  devtools(
    persist(
      (set, get) => ({
        metrics: [],
        processes: [],
        status: 'offline',
        
        setMetrics: (metrics) => set({ metrics }),
        setProcesses: (processes) => set({ processes }),
        setStatus: (status) => set({ status }),
        
        fetchSystemData: async () => {
          try {
            const response = await fetch('/api/system')
            const data = await response.json()
            
            if (data.success) {
              set({
                metrics: data.data.metrics,
                processes: data.data.processes,
                status: data.data.systemStatus
              })
            }
          } catch (error) {
            console.error('Failed to fetch system data:', error)
            set({ status: 'offline' })
          }
        }
      }),
      {
        name: 'system-store',
        partialize: (state) => ({ status: state.status })
      }
    )
  )
)
```

### Security Best Practices

#### Input Sanitization

```typescript
import DOMPurify from 'dompurify'

// Sanitize user input
const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })
}

// Validate and sanitize API input
const validateAndSanitize = (input: unknown): string | null => {
  if (typeof input !== 'string') return null
  if (input.length > 1000) return null
  return sanitizeInput(input.trim())
}
```

#### Rate Limiting

```typescript
// lib/rateLimit.ts
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export const rateLimit = (
  identifier: string,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000
): boolean => {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}
```

---

## 📚 Additional Resources

### Documentation

- [API Documentation](./API.md) - Complete API reference
- [Component Documentation](./COMPONENTS.md) - Component reference
- [Architecture Documentation](./ARCHITECTURE.md) - System architecture
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

### Tools and Utilities

- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting
- [Jest](https://jestjs.io/) - Testing framework
- [Playwright](https://playwright.dev/) - E2E testing
- [Storybook](https://storybook.js.org/) - Component development

---

*This developer guide provides comprehensive information for contributing to the Anoma AGI Operating System. For questions or support, please refer to the project documentation or contact the development team.*