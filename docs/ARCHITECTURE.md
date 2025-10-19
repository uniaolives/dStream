# 🏗️ Architecture Documentation

## System Overview

The Anoma AGI Operating System follows a modern, scalable architecture pattern that separates concerns into distinct layers while maintaining high cohesion and low coupling. The system is designed to be modular, maintainable, and extensible.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │   Dashboard │ │ AI Assistant│ │   Terminal  │ │Security │ │
│  │   Component │ │  Component  │ │  Component  │ │Component│ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │   State     │ │   Hooks     │ │   Utils     │ │Services │ │
│  │ Management  │ │ & Effects   │ & Helpers   │ │ Layer   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│                      API Layer                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │ /api/system │ │/api/ai-assist│ │/api/network │ │/api/fs  │ │
│  │   Route     │ │    Route     │ │   Route     │ │ Route   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│                   Data & Services Layer                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │   System    │ │z-ai-web-sdk │ │   Network   │ │Database │ │
│  │  Monitor    │ │   AI Core   │ │  Monitor    │ │Prisma   │ │
│  │  Service    │ │  Service    │ │  Service    │ │ ORM     │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│                  Infrastructure Layer                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │   Next.js   │ │   Node.js   │ │   Socket.io │ │ SQLite  │ │
│  │   Runtime   │ │   Runtime   │ │ WebSocket   │ │Database │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Layer Architecture

### 1. Presentation Layer (Frontend)

**Technology Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS

**Responsibilities**:
- User interface rendering
- User interaction handling
- Real-time data visualization
- Responsive design implementation

**Key Components**:
- **Dashboard**: Main system overview
- **AI Assistant**: Neural chat interface
- **Terminal**: Command-line interface
- **Security Center**: Security monitoring dashboard
- **File Explorer**: File system browser
- **Settings Panel**: Configuration management

**Data Flow**:
```
User Interaction → Component State → API Calls → State Updates → UI Re-render
```

### 2. Application Layer (Business Logic)

**Technology Stack**: React Hooks, Zustand, Custom Services

**Responsibilities**:
- State management
- Business logic implementation
- Data transformation
- Client-side validation

**Key Modules**:
- **State Management**: Global state with Zustand
- **Custom Hooks**: Reusable logic (useTerminal, useFileSystem)
- **Utilities**: Helper functions and validators
- **Services**: API integration layer

**Architecture Patterns**:
```typescript
// Custom Hook Pattern
const useSystemMonitor = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([])
  const [loading, setLoading] = useState(false)
  
  const fetchMetrics = useCallback(async () => {
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
  }, [])
  
  return { metrics, loading, fetchMetrics }
}
```

### 3. API Layer (Backend)

**Technology Stack**: Next.js API Routes, TypeScript, Zod Validation

**Responsibilities**:
- HTTP request handling
- Input validation
- Business logic orchestration
- Response formatting

**API Endpoints**:
```
GET    /api/system          - System metrics and processes
POST   /api/ai-assistant    - AI assistant chat
GET    /api/network         - Network activity monitoring
GET    /api/filesystem      - File system operations
```

**Request/Response Pattern**:
```typescript
// API Route Structure
export async function GET(request: NextRequest) {
  try {
    // Input validation
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path') || '/'
    
    // Business logic
    const data = await fetchFileSystemData(path)
    
    // Response formatting
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    // Error handling
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch filesystem data',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
```

### 4. Data & Services Layer

**Technology Stack**: Prisma ORM, SQLite, z-ai-web-dev-sdk

**Responsibilities**:
- Data persistence
- External service integration
- Data transformation
- Business rule enforcement

**Key Services**:
- **Database Service**: Data persistence with Prisma
- **AI Service**: Integration with z-ai-web-dev-sdk
- **System Monitor**: Real-time system metrics
- **Network Monitor**: Network activity tracking

**Service Pattern**:
```typescript
// AI Service Example
class AIService {
  private zai: ZAI
  
  async initialize() {
    this.zai = await ZAI.create()
  }
  
  async chat(message: string, context: any) {
    const completion = await this.zai.chat.completions.create({
      messages: [
        { role: 'system', content: this.buildSystemPrompt(context) },
        { role: 'user', content: message }
      ]
    })
    
    return completion.choices[0]?.message?.content
  }
  
  private buildSystemPrompt(context: any): string {
    return `You are the neural AI assistant... Current context: ${JSON.stringify(context)}`
  }
}
```

### 5. Infrastructure Layer

**Technology Stack**: Node.js, SQLite, Socket.io

**Responsibilities**:
- Runtime environment
- Database management
- Real-time communication
- System integration

**Components**:
- **Next.js Runtime**: Server-side rendering and API routes
- **SQLite Database**: Lightweight data persistence
- **Socket.io**: Real-time WebSocket communication
- **File System**: Native file operations

## Data Flow Architecture

### Request Flow

```
1. User Action (Browser)
   ↓
2. React Component Event Handler
   ↓
3. State Update / API Call
   ↓
4. Next.js API Route
   ↓
5. Business Logic / Service Layer
   ↓
6. Database / External API
   ↓
7. Response Processing
   ↓
8. State Update
   ↓
9. UI Re-render
```

### Real-time Data Flow

```
System Events → Event Emitters → WebSocket → Client Updates → UI Refresh
```

## Component Architecture

### Component Hierarchy

```
AnomaOS (Root)
├── Header
│   ├── Logo
│   ├── Status Badges
│   └── System Time
├── SystemMetricsGrid
│   ├── SystemMetricsCard
│   ├── ProcessMonitor
│   └── NetworkActivityMonitor
├── NeuralCommandCenter
│   ├── TabNavigation
│   ├── TerminalTab
│   ├── AIAssistantTab
│   ├── SecurityTab
│   ├── SettingsTab
│   └── FileSystemTab
└── StatusBar
    ├── SystemStatus
    ├── NetworkStatus
    └── UptimeDisplay
```

### Component Communication Patterns

1. **Props Drilling**: Parent to child data flow
2. **Context API**: Global state sharing
3. **Custom Hooks**: Reusable state logic
4. **Event Emitters**: Cross-component communication

## Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Security                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │   Input     │ │   Output    │ │   Session   │ │   CSRF  │ │
│  │ Validation  │ │ Encoding    │ │ Management  │ │Protection│ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    API Security                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │   Rate      │ │   CORS      │ │   Auth      │ │ HTTPS   │ │
│  │ Limiting    │ │ Policy      │ │ Middleware  │ │ Only    │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│                   Infrastructure Security                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │   Network   │ │   Database  │ │   File      │ │Environment│ │
│  │ Security    │ │ Encryption  │ │ Permissions │ │ Variables │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Security Measures

1. **Input Validation**: Zod schemas for all API inputs
2. **Output Encoding**: XSS prevention
3. **CORS Configuration**: Restricted cross-origin requests
4. **Environment Variables**: Secure configuration management
5. **Database Security**: Encrypted connections and access controls

## Performance Architecture

### Optimization Strategies

1. **Code Splitting**: Route-based and component-based splitting
2. **Lazy Loading**: Dynamic imports for heavy components
3. **Caching**: API response caching and browser caching
4. **Bundle Optimization**: Tree shaking and minification
5. **Image Optimization**: Next.js Image component

### Performance Monitoring

```typescript
// Performance monitoring setup
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  // Send to analytics service
  console.log(metric)
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

## Scalability Architecture

### Horizontal Scaling

```
Load Balancer
    ↓
┌─────────┬─────────┬─────────┐
│ Node 1  │ Node 2  │ Node 3  │
│ Instance│ Instance│ Instance│
└─────────┴─────────┴─────────┘
    ↓
Shared Database
```

### Vertical Scaling

- **CPU Optimization**: Efficient algorithms and data structures
- **Memory Management**: Proper cleanup and garbage collection
- **I/O Optimization**: Async operations and connection pooling

## Deployment Architecture

### Development Environment

```
Developer Machine
    ↓
Git Repository
    ↓
Development Server (npm run dev)
    ↓
Local Database (SQLite)
```

### Production Environment

```
CI/CD Pipeline
    ↓
Build Process (npm run build)
    ↓
Production Server
    ↓
Load Balancer
    ↓
Application Instances
    ↓
Production Database
```

## Monitoring & Observability

### Logging Architecture

```typescript
// Structured logging
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})
```

### Metrics Collection

- **Application Metrics**: Response times, error rates
- **System Metrics**: CPU, memory, disk usage
- **Business Metrics**: User interactions, feature usage

## Future Architecture Considerations

### Microservices Migration

```
Current Monolith
    ↓
┌─────────────┬─────────────┬─────────────┐
│   System    │     AI      │   Network   │
│  Service    │   Service   │  Service    │
└─────────────┴─────────────┴─────────────┘
    ↓
API Gateway
    ↓
Client Applications
```

### Event-Driven Architecture

```
Event Bus
    ↓
┌─────────────┬─────────────┬─────────────┐
│   System    │     AI      │   Network   │
│  Events     │   Events    │  Events     │
└─────────────┴─────────────┴─────────────┘
```

## Architecture Decision Records (ADRs)

### ADR-001: Technology Stack Selection
**Decision**: Use Next.js 15 with TypeScript
**Rationale**: Type safety, excellent performance, great developer experience
**Consequences**: Learning curve for TypeScript, build complexity

### ADR-002: Database Choice
**Decision**: Use SQLite with Prisma ORM
**Rationale**: Simplicity, portability, zero configuration
**Consequences**: Limited scalability, single-writer limitation

### ADR-003: UI Framework
**Decision**: Use shadcn/ui with Tailwind CSS
**Rationale**: Consistent design system, excellent accessibility
**Consequences**: Dependency on external component library

---

## 📚 Related Documentation

- [API Documentation](./API.md) - Detailed API endpoint documentation
- [Component Documentation](./COMPONENTS.md) - Component reference guide
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment instructions
- [Developer Guide](./DEVELOPER.md) - Development setup and workflows