# Windsor Knowledge Base Chat Interface

A React-based chat interface that integrates with n8n workflows using the `@n8n/chat` library. This application provides a custom UI for chatbot interactions while maintaining session persistence and file upload capabilities.

## 🌟 Features

- **Custom Chat UI**: Beautiful, responsive chat interface with modern design
- **File Upload Support**: Upload and send files with your messages
- **Session Persistence**: Conversation history maintained across browser sessions
- **n8n Integration**: Direct integration with n8n workflows via webhooks
- **Real-time Communication**: Instant message delivery and responses
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices

## 🚀 What's New

This implementation enhances your original chat interface with:

### Enhanced n8n Integration

- Uses `@n8n/chat` library principles while keeping your custom UI
- Proper session management with `sessionId` generation
- Support for `loadPreviousSession` and `sendMessage` actions
- Compatible with n8n Chat Trigger nodes

### File Upload Functionality

- Multiple file selection and upload
- File preview with name, size, and type information
- File removal before sending
- Visual file attachment indicators in messages
- Support for all file types

### Improved UX

- Loading states and animations
- Better error handling
- File size formatting
- Responsive design improvements
- Accessible UI components

## 📦 Installation

The project is already set up with all necessary dependencies:

```bash
# Dependencies already installed:
# - @n8n/chat: ^0.50.0
# - react: ^19.1.0
# - react-dom: ^19.1.0

# Start the development server
npm run dev
```

## 🔧 Configuration

### Frontend Configuration

The chat interface is configured in `src/App.tsx`:

```typescript
// n8n webhook configuration
const webhookUrl =
  "https://mypath2tech.app.n8n.cloud/webhook/6ac574cc-5aa8-4993-916b-6682d4f37bbc/chat";
```

### n8n Workflow Setup

To use this interface with your n8n workflow, you need to:

1. **Configure Chat Trigger Node**:

   - Mode: Embedded Chat
   - Response Mode: Using Response Nodes
   - Load Previous Session: From Memory
   - Allowed Origins: Your domain or `*` for development

2. **Handle Different Actions**: Your workflow should handle:
   - `action: "loadPreviousSession"` - Load conversation history
   - `action: "sendMessage"` - Process new messages and files

See `n8n-workflow-example.md` for detailed workflow configuration.

## 💬 Message Structure

### Text Messages

```json
{
  "action": "sendMessage",
  "chatInput": "User's message",
  "sessionId": "session_12345",
  "message": "User's message",
  "timestamp": "2025-01-08T10:30:00Z"
}
```

### Messages with Files

```json
{
  "action": "sendMessage",
  "chatInput": "User's message",
  "sessionId": "session_12345",
  "message": "User's message",
  "timestamp": "2025-01-08T10:30:00Z",
  "attachments": [
    {
      "name": "document.pdf",
      "size": 2048576,
      "type": "application/pdf",
      "url": "blob:..."
    }
  ],
  "hasFiles": true,
  "fileCount": 1,
  "fileNames": ["document.pdf"],
  "fileSizes": [2048576],
  "fileTypes": ["application/pdf"]
}
```

## 🎨 UI Components

### File Upload Button

- Green paperclip icon in the input area
- Click to select multiple files
- Hover effects and disabled states

### File Preview Area

- Appears above input when files are selected
- Shows file name, size, and type
- Individual file removal buttons
- Clear all files button

### Message Attachments

- File indicators in sent messages
- File name and size display
- Consistent styling with message bubbles

## 🔄 Session Management

- **Automatic Session Creation**: Generates unique session IDs
- **Local Storage**: Persists session ID across browser refreshes
- **History Loading**: Attempts to load previous conversation on startup
- **Memory Integration**: Works with n8n memory nodes for conversation context

## 📱 Responsive Design

The interface adapts to different screen sizes:

- **Desktop**: Full-width chat with optimal spacing
- **Tablet**: Adjusted margins and component sizes
- **Mobile**: Compact layout with touch-friendly buttons

## 🎯 File Handling

### Supported Features

- Multiple file selection
- All file types accepted (`accept="*/*"`)
- File size display with proper formatting
- Preview before sending
- File metadata sent to n8n workflow

### File Processing

Files are converted to blob URLs for preview. For production use, consider:

- Uploading to cloud storage (AWS S3, Google Drive)
- Implementing file size limits
- Adding virus scanning
- File type restrictions

## 🔧 Development

### Project Structure

```
src/
├── App.tsx          # Main chat component with enhanced functionality
├── App.css          # Styles including file upload components
├── main.tsx         # React app entry point
└── vite-env.d.ts    # TypeScript declarations
```

### Key Functions

- `sendMessage()`: Handles message and file sending
- `handleFileSelect()`: Manages file selection
- `uploadFiles()`: Processes files for sending
- `loadPreviousSession()`: Retrieves conversation history
- `generateSessionId()`: Creates unique session identifiers

## 🐛 Troubleshooting

### Common Issues

1. **Files not uploading**: Check file size and browser limitations
2. **Session not persisting**: Verify localStorage is enabled
3. **n8n connection failed**: Check webhook URL and CORS settings
4. **Messages not appearing**: Verify n8n workflow is active

### Debug Tips

1. **Check Browser Console**: Look for JavaScript errors
2. **Network Tab**: Monitor webhook requests and responses
3. **n8n Executions**: Check workflow execution logs
4. **Local Storage**: Verify session ID is stored

## 🔒 Security Considerations

- **File Validation**: Implement file type and size restrictions
- **CORS Configuration**: Restrict origins in production
- **Authentication**: Add user authentication if needed
- **Rate Limiting**: Prevent spam and abuse
- **File Scanning**: Scan uploads for malware

## 🚀 Production Deployment

Before deploying to production:

1. **Update webhook URL** to production n8n instance
2. **Configure CORS** with specific domain origins
3. **Implement file upload limits** and validation
4. **Add authentication** if required
5. **Set up monitoring** and error tracking
6. **Configure HTTPS** for secure communication

## 📖 Additional Resources

- [n8n Chat Trigger Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-langchain.chattrigger/)
- [n8n/chat Library Documentation](https://www.npmjs.com/package/@n8n/chat)
- [React File Upload Best Practices](https://react.dev)
- [n8n Workflow Configuration Example](./n8n-workflow-example.md)

## 🤝 Contributing

This implementation provides a solid foundation for n8n chat integration. Feel free to:

- Add more file processing features
- Implement authentication systems
- Enhance the UI with additional components
- Add more sophisticated error handling
- Optimize for performance and accessibility

## 📄 License

This project maintains the same license as your original implementation.
