# 📡 API Documentation

## Overview

The Anoma AGI OS provides a comprehensive REST API for system monitoring, AI assistance, network management, and file system operations. All APIs return JSON responses and follow RESTful conventions.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API operates without authentication for development purposes. In production, implement NextAuth.js or JWT-based authentication.

## Response Format

All API responses follow this standard format:

```typescript
interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}
```

## Endpoints

### 🖥️ System Monitoring API

#### Get System Metrics

```http
GET /api/system
```

**Description**: Retrieves real-time system metrics, running processes, and system status.

**Response**:
```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "label": "CPU Usage",
        "value": 45.2,
        "max": 100,
        "unit": "%",
        "status": "normal"
      },
      {
        "label": "Memory",
        "value": 6.2,
        "max": 16,
        "unit": "GB",
        "status": "normal"
      },
      {
        "label": "Neural Network Load",
        "value": 78.5,
        "max": 100,
        "unit": "%",
        "status": "warning"
      },
      {
        "label": "Quantum Coherence",
        "value": 92.1,
        "max": 100,
        "unit": "%",
        "status": "normal"
      },
      {
        "label": "Data Stream",
        "value": 234.7,
        "max": 1000,
        "unit": "MB/s",
        "status": "normal"
      },
      {
        "label": "AI Processing",
        "value": 89.3,
        "max": 100,
        "unit": "%",
        "status": "normal"
      }
    ],
    "processes": [
      {
        "id": "1",
        "name": "Neural Core Engine",
        "cpu": 35.2,
        "memory": 2.1,
        "status": "running",
        "priority": "high"
      },
      {
        "id": "2",
        "name": "Quantum Processor",
        "cpu": 28.7,
        "memory": 1.8,
        "status": "running",
        "priority": "high"
      }
    ],
    "systemStatus": "online",
    "aiCoreActive": true,
    "quantumProcessing": true
  },
  "timestamp": "2024-01-15T12:34:56.789Z"
}
```

**Data Types**:
```typescript
interface SystemMetric {
  label: string
  value: number
  max: number
  unit: string
  status: 'normal' | 'warning' | 'critical'
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

---

### 🤖 AI Assistant API

#### Chat with AI Assistant

```http
POST /api/ai-assistant
```

**Description**: Interact with the neural AI assistant for system optimization and guidance.

**Request Body**:
```json
{
  "message": "Optimize system performance for quantum computing",
  "context": {
    "systemStatus": "online",
    "metrics": [...],
    "processes": [...],
    "quantumProcessing": true
  }
}
```

**Response**:
```json
{
  "success": true,
  "response": "I'll analyze your system configuration and optimize for quantum computing operations. Based on your current metrics, I recommend adjusting the neural network load distribution and increasing quantum coherence stability...",
  "timestamp": "2024-01-15T12:34:56.789Z"
}
```

**Request Types**:
```typescript
interface AIRequest {
  message: string
  context?: {
    systemStatus?: string
    metrics?: SystemMetric[]
    processes?: Process[]
    quantumProcessing?: boolean
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Failed to process AI request",
  "timestamp": "2024-01-15T12:34:56.789Z"
}
```

---

### 🌐 Network Monitoring API

#### Get Network Activity

```http
GET /api/network
```

**Description**: Retrieves network activity, connections, and security events.

**Response**:
```json
{
  "success": true,
  "data": {
    "activity": [
      {
        "timestamp": "12:34:56",
        "source": "Neural Core",
        "destination": "Data Node Alpha",
        "protocol": "Quantum Link",
        "status": "allowed"
      },
      {
        "timestamp": "12:34:52",
        "source": "Security Monitor",
        "destination": "Firewall",
        "protocol": "Encrypted",
        "status": "monitoring"
      }
    ],
    "stats": {
      "totalConnections": 1234,
      "activeConnections": 156,
      "blockedConnections": 8,
      "dataTransferred": 5678.9,
      "bandwidthUsage": 234.5
    },
    "networkStatus": "optimal",
    "securityLevel": "high"
  },
  "timestamp": "2024-01-15T12:34:56.789Z"
}
```

**Data Types**:
```typescript
interface NetworkActivity {
  timestamp: string
  source: string
  destination: string
  protocol: string
  status: 'allowed' | 'blocked' | 'monitoring'
}

interface NetworkStats {
  totalConnections: number
  activeConnections: number
  blockedConnections: number
  dataTransferred: number // MB
  bandwidthUsage: number // Mbps
}
```

---

### 💾 File System API

#### Get Directory Contents

```http
GET /api/filesystem?path=/neural-core
```

**Description**: Retrieves file system contents and storage statistics for a given path.

**Query Parameters**:
- `path` (string): Directory path to explore (default: "/")
- `action` (string, optional): Set to "stats" to get only storage statistics

**Response**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "1",
        "name": "synapses.dat",
        "type": "file",
        "size": 536870912,
        "modified": "2024-01-15T10:30:00Z",
        "permissions": "rw-------",
        "owner": "neural-core",
        "path": "/neural-core/synapses.dat"
      },
      {
        "id": "2",
        "name": "training-data",
        "type": "directory",
        "size": 0,
        "modified": "2024-01-15T09:00:00Z",
        "permissions": "rwxr-xr-x",
        "owner": "neural-core",
        "path": "/neural-core/training-data"
      }
    ],
    "currentPath": "/neural-core",
    "stats": {
      "totalSpace": 1099511627776,
      "usedSpace": 536870912000,
      "freeSpace": 562641715776,
      "totalFiles": 1048576,
      "totalDirectories": 65536
    }
  },
  "timestamp": "2024-01-15T12:34:56.789Z"
}
```

**Data Types**:
```typescript
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

interface FileSystemStats {
  totalSpace: number
  usedSpace: number
  freeSpace: number
  totalFiles: number
  totalDirectories: number
}
```

---

## 🔧 Usage Examples

### JavaScript/TypeScript

```typescript
// Fetch system metrics
const response = await fetch('/api/system')
const data = await response.json()

if (data.success) {
  console.log('CPU Usage:', data.data.metrics.find(m => m.label === 'CPU Usage')?.value)
}

// Send message to AI assistant
const aiResponse = await fetch('/api/ai-assistant', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Analyze system performance',
    context: { systemStatus: 'online' }
  })
})

const aiData = await aiResponse.json()
console.log('AI Response:', aiData.response)
```

### Python

```python
import requests
import json

# Get system metrics
response = requests.get('http://localhost:3000/api/system')
data = response.json()

if data['success']:
    cpu_usage = next(m['value'] for m in data['data']['metrics'] if m['label'] == 'CPU Usage')
    print(f"CPU Usage: {cpu_usage}%")

# Chat with AI assistant
ai_response = requests.post('http://localhost:3000/api/ai-assistant', 
    json={
        'message': 'Optimize system performance',
        'context': {'systemStatus': 'online'}
    }
)

ai_data = ai_response.json()
print(f"AI Response: {ai_data['response']}")
```

### cURL

```bash
# Get system metrics
curl -X GET http://localhost:3000/api/system

# Get network activity
curl -X GET http://localhost:3000/api/network

# Get file system contents
curl -X GET "http://localhost:3000/api/filesystem?path=/"

# Send message to AI assistant
curl -X POST http://localhost:3000/api/ai-assistant \
  -H "Content-Type: application/json" \
  -d '{
    "message": "System status check",
    "context": {"systemStatus": "online"}
  }'
```

## 🚨 Error Handling

All APIs return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found
- `500` - Internal Server Error

Error responses include detailed error messages:

```json
{
  "success": false,
  "error": "Failed to fetch system data",
  "timestamp": "2024-01-15T12:34:56.789Z"
}
```

## 🔄 Real-time Updates

For real-time data updates, the frontend polls APIs at regular intervals:
- System metrics: Every 5 seconds
- Network activity: Every 3 seconds
- File system: On navigation

For production, consider implementing WebSocket connections for true real-time updates.

## 📊 Rate Limiting

Currently, no rate limiting is implemented for development. In production, implement rate limiting to prevent abuse:

```typescript
// Example rate limiting middleware
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
```

## 🔒 Security Considerations

1. **Input Validation**: All inputs are validated using Zod schemas
2. **CORS**: Configure appropriate CORS policies for production
3. **Authentication**: Implement NextAuth.js or JWT authentication
4. **HTTPS**: Use HTTPS in production
5. **Sanitization**: Sanitize all user inputs to prevent XSS

## 📝 API Versioning

Current version: v1

Future versions will be versioned using URL patterns:
- `/api/v1/system` - Current version
- `/api/v2/system` - Future versions

## 🧪 Testing

API endpoints can be tested using:
- Browser DevTools Network tab
- Postman collection
- Automated tests with Jest and Supertest

Example test:
```typescript
import request from 'supertest'
import { app } from '../server'

test('GET /api/system returns system metrics', async () => {
  const response = await request(app)
    .get('/api/system')
    .expect(200)
  
  expect(response.body.success).toBe(true)
  expect(response.body.data.metrics).toBeDefined()
})
```