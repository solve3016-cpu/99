# Lovable Fast Chat - Stateless Edition

A lightweight system to provide direct chat for Lovable.dev projects without using a database.

## 📦 Components

1. **Chrome Extension** (`/extension`)
   - Simple UI for sending messages
   - Captures cookies and project IDs automatically
   - Settings to configure your Render URL

2. **Backend API** (`/backend`)
   - Node.js server to forward messages to Lovable.dev
   - **No Database required**
   - Ready to deploy to Render.com

## 🚀 Deployment Guide

### Step 1: Deploy Backend to Render

1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository (or upload the `/backend` folder)
4. Configure:
   - **Name**: `lovable-chat-api`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click "Create Web Service"
6. **Copy the URL** Render gives you (e.g., `https://lovable-chat-api.onrender.com`)

### Step 2: Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `/extension` folder
5. Click the extension icon in your toolbar

### Step 3: Configure and Chat

1. Click "Setup API" in the extension popup
2. Paste your **Render Backend URL**
3. Click "Save Configuration"
4. Open any project on **lovable.dev**
5. Start chatting!

## 🔧 Customization

- To change the UI, edit `extension/popup.html` and `extension/popup.js`
- To change the forwarding logic, edit `backend/server.js`

## 🔐 Security

- This version has **no authentication** (no API keys). Anyone with your Render URL can use it.
- Your Render URL is private, so don't share it publicly.
- All cookies are handled locally by the extension.
