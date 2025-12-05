# Chat Implementation Analysis

## Overview
This document analyzes the chat functionality in both the original React Native Web app and the Next.js implementation.

---

## Original App Structure

### ChatScreen.tsx
**Location**: `web-apps/extrahand-web-app/src/ChatScreen.tsx`

**Features**:
- **Dual Layout**: Separate mobile and desktop layouts
- **Mobile View**:
  - List view with search
  - Tap conversation to open chat
  - Back button to return to list
  - Search bar for finding chats or users
- **Desktop View**:
  - Sidebar with conversations list
  - Main chat pane for messages
  - Two-column layout
- **Search Functionality**:
  - Search existing conversations
  - Search users to start new chat
  - User search results show name, roles, email, rating
- **Message Features**:
  - Message bubbles (sent/received with different styling)
  - Timestamp formatting (time, "Yesterday", day of week)
  - Unread count badges
  - Real-time message sending
- **Direct Navigation**:
  - Supports navigation with `chatId`, `otherUserId`, `taskId`, `taskTitle` params
  - Automatically opens specific chat when navigated from task/application
- **API Integration**:
  - `api.getChats()` - Fetch all conversations
  - `api.getChatMessages(chatId)` - Fetch messages for a chat
  - `api.sendMessage(chatId, text)` - Send a message
  - `api.startChat(otherUserId, taskId?)` - Start new chat
  - `api.searchUsers(query)` - Search for users
  - `api.markChatAsRead(chatId)` - Mark messages as read
  - `api.getProfile(userId)` - Get user profile for display

**Key UI Elements**:
- Header with back button and chat title
- Search bar (top of sidebar/list)
- Conversation list items with:
  - Other participant name and roles
  - Last message preview
  - Timestamp
  - Unread count badge
- Message bubbles:
  - Sent messages: Yellow background (`PRIMARY_YELLOW`)
  - Received messages: White background with border
  - Timestamp below message
- Input bar with text input and send button
- User search results with "Chat" button

---

## Next.js Implementation

### Chat Page
**Location**: `web-apps/extrahand-web-app-nextjs/app/chat/page.tsx`

**Status**: ✅ **IMPLEMENTED**

**Features**:
- ✅ Mobile and desktop responsive layouts
- ✅ Conversation list with search
- ✅ User search functionality (mock)
- ✅ Message bubbles with proper styling
- ✅ Timestamp formatting
- ✅ Unread count badges
- ✅ Direct navigation support (URL params: `chatId`, `otherUserId`, `taskId`, `taskTitle`)
- ✅ Send message functionality (mock)
- ✅ Empty state when no chat selected (desktop)
- ✅ NavBar and Footer integration
- ⚠️ **NO API CALLS** (mock data only - as per user request)

**Differences from Original**:
- Uses Tailwind CSS instead of StyleSheet
- Uses Next.js router and searchParams instead of React Navigation
- Mock conversations and messages data
- Simplified user search (filtering mock data instead of API call)
- Enter key support for sending messages

---

## Navigation Flow

### Starting a Chat
1. **From My Applications**:
   - User clicks "💬 Chat" on accepted application
   - Navigate to `/chat?taskId={id}&taskTitle={title}&otherUserId={id}`
   - Chat page opens with that user's chat (or creates new)

2. **From Task Tracking**:
   - User clicks "💬 Send Message"
   - Navigate to `/chat?chatId={id}&otherUserId={id}&taskId={id}&taskTitle={title}`
   - Chat page opens with that chat

3. **From Chat List**:
   - User searches for user or selects existing conversation
   - Opens chat in mobile view or selects in desktop sidebar

### Chat Features
- **Search**: Type in search bar to filter conversations or find users
- **New Chat**: Search for users, click "Chat" button to start
- **Send Message**: Type message and click "Send" or press Enter
- **View Messages**: Scrollable message list with timestamps

---

## Data Structures

### Conversation
```typescript
interface Conversation {
  _id: string;
  chatId: string;
  otherParticipant: {
    uid: string;
    name: string;
    roles: string[];
    userType: string;
  };
  lastMessage: {
    text: string;
    senderId: string;
    timestamp: string;
  };
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}
```

### Message
```typescript
interface Message {
  _id: string;
  chatId: string;
  text: string;
  senderId: string;
  type: string;
  status: string;
  createdAt: string;
  readBy: Array<{
    userId: string;
    readAt: string;
  }>;
}
```

---

## Styling Details

### Colors
- **Primary Yellow**: `#f9b233` - Sent message bubbles
- **Primary Blue**: `#2563EB` - Unread badges, accents
- **Dark**: `#111827` - Text color
- **Gray**: `#6b7280` - Secondary text
- **Light BG**: `#f8fafc` - Chat pane background

### Message Bubbles
- **Sent (Me)**: Yellow background, dark text, bold
- **Received (Them)**: White background, border, dark text
- **Timestamp**: Small text below message (gray for received, dark for sent)

### Layout
- **Mobile**: Full-screen list or full-screen chat
- **Desktop**: Sidebar (320px) + Chat pane (flex-1)
- **Search Bar**: Top of sidebar/list
- **Input Bar**: Bottom of chat pane

---

## Future API Integration Points

When connecting to the backend, these endpoints will be needed:

1. **Get Chats**: `GET /api/chats`
   - Returns list of conversations with last message and unread counts
   
2. **Get Messages**: `GET /api/chats/:chatId/messages`
   - Returns messages for a specific chat
   
3. **Send Message**: `POST /api/chats/:chatId/messages`
   - Body: `{ text: string }`
   - Returns sent message
   
4. **Start Chat**: `POST /api/chats`
   - Body: `{ otherUserId: string, taskId?: string }`
   - Returns created chat with chatId
   
5. **Search Users**: `GET /api/users/search?q={query}`
   - Returns list of users matching search query
   
6. **Mark as Read**: `PUT /api/chats/:chatId/read`
   - Marks all messages in chat as read
   
7. **Get Profile**: `GET /api/profiles/:userId`
   - Returns user profile for display

---

## Notes

- All API calls are currently disabled per user request
- Chat uses mock conversations and messages
- Navigation uses Next.js router instead of React Navigation
- Styling converted from React Native StyleSheet to Tailwind CSS
- Enter key support added for better UX
- Real-time updates would require WebSocket or polling (not implemented)
- File/image attachments not implemented (placeholder only)
