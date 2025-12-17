# Secret Santa Jingle Bells Website

A festive website that plays a Jingle Bells video and collects phone numbers to send Amazon vouchers.

## Setup Instructions

### 1. Add Your Jingle Bells Video

Place your Jingle Bells video file in the `public` directory and name it `jingle-bells.mp4`:

```bash
# Copy your video file to the public directory
cp /path/to/your/video.mp4 public/jingle-bells.mp4
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Voucher Delivery (Required for Production)

Edit `app/api/send-voucher/route.ts` to integrate with your preferred delivery method:

#### Option A: SMS via Twilio
```bash
npm install twilio
```

Add to `.env.local`:
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

#### Option B: Email via SendGrid
```bash
npm install @sendgrid/mail
```

Add to `.env.local`:
```
SENDGRID_API_KEY=your_api_key
```

#### Option C: WhatsApp Business API
Configure according to your provider's documentation.

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5. Generate QR Code

Once deployed, use a QR code generator to create a QR code pointing to your website URL.

## Features

- ✅ Auto-playing Jingle Bells video (unskippable)
- ✅ Phone number validation (Indian format: 10 digits starting with 6-9)
- ✅ Responsive design with Tailwind CSS
- ✅ shadcn/ui components for polished UI
- ✅ API endpoint for voucher delivery
- ⚠️ **TODO**: Integrate with actual voucher delivery service
- ⚠️ **TODO**: Add database to prevent duplicate claims
- ⚠️ **TODO**: Add your Jingle Bells video file

## Important Notes

- **Video Autoplay**: Some browsers block autoplay with sound. Users may need to tap the screen to start the video.
- **Video Controls**: Controls are hidden but users can still pause. For true unskippable experience, consider disabling pause functionality with JavaScript.
- **Production**: Remove debug logging and implement proper voucher delivery before deploying.

## Deployment

```bash
npm run build
npm start
```

Deploy to Vercel, Netlify, or your preferred hosting platform.
