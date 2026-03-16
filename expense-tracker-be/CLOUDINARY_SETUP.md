# Cloudinary Setup Guide

## What is Cloudinary?

Cloudinary is a cloud-based image and video management platform. It's perfect for:

- Storing and serving images
- Image optimization (auto-resize, auto-quality)
- CDN delivery (fast loading worldwide)
- Free tier: 25GB storage/month

## How to Setup Cloudinary (Free)

### 1. Create Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Click "Sign Up for Free"
3. Fill in your information:
   - Email: Enter your email
   - Password: Create a secure password
   - Company Name: Enter any name (e.g., "Expense Tracker")

### 2. Get Your Credentials

After signing up:

1. Go to Dashboard
2. Copy your **Cloud Name** (e.g., `your-cloud-name`)
3. Copy your **API Key**
4. Copy your **API Secret**

### 3. Add to `.env` file

Open `expense-tracker-be/.env` and add:

```env
CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-api-secret
```

Replace the values with your actual credentials from步骤 2.

### 4. Restart Backend Server

```bash
cd expense-tracker-be
npm run dev
```

## Features Included

### Automatic Image Optimization

- Images are automatically resized to 500x500 pixels
- Quality is optimized automatically
- Images are served via CDN for fast loading

### Organized Storage

- All avatars are stored in: `expense-tracker/avatars/` folder
- Each image is named: `avatar-{timestamp}-{original-name}`

### Example Cloudinary URL

```
https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/expense-tracker/avatars/avatar-1234567890-my-photo.jpg
```

## Free Tier Limits (as of 2026)

- ✅ **25GB storage** per month
- ✅ **25GB bandwidth** per month
- ✅ **25,000 transformations** per month
- ✅ **Unlimited requests**

This is more than enough for a personal expense tracker app!

## Testing

1. Start backend server
2. Try uploading an avatar via frontend
3. Check logs - you should see:

```
INFO    Uploading image to Cloudinary: my-photo.jpg
SUCCESS Image uploaded successfully: https://res.cloudinary.com/...
```

## Troubleshooting

### Error: "Cloudinary config is missing"

**Solution:** Make sure you added all 3 environment variables to `.env`

### Error: "Invalid credentials"

**Solution:** Double-check your Cloud Name, API Key, and API Secret

### Error: "Upload failed"

**Solution:** Check your internet connection and verify your Cloudinary account is active

## Deleting Old Images

Cloudinary keeps uploaded images forever. To clean up old avatars:

1. Go to Cloudinary Dashboard
2. Navigate to Media Library
3. Go to `expense-tracker/avatars` folder
4. Select and delete unwanted images

## Alternative: Using Default (No Cloudinary)

If you don't want to set up Cloudinary, the app still works with local storage:

- Images are saved to `expense-tracker-be/public/uploads/avatars/`
- Images are served from your backend server
- **Limitations:** No CDN, no auto-optimization

## Support

- Cloudinary Docs: <https://cloudinary.com/documentation>
- Node.js SDK: <https://cloudinary.com/documentation/node_integration>
