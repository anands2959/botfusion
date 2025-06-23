# BotFusion - Self-Hosted AI Chatbot Solution

<p align="center">
  <img src="/public/botfusion-logo.png" alt="BotFusion Logo" width="300">
</p>

BotFusion is a self-hosted, open-source AI chatbot platform that allows you to create intelligent chatbots powered by your own content - websites, PDFs, and documents. With complete control over your data and AI models, BotFusion provides a privacy-focused solution for enhancing customer support and engagement.

## Features

- **Multi-Source Knowledge Base**: Connect your website URL, upload PDFs, or add documents directly. Our system automatically processes and indexes your content to create an intelligent knowledge base.

- **Fully Customizable UI**: Complete control over your chatbot's appearance. Customize the logo, color scheme, position, and behavior to perfectly match your brand identity and website design.

- **Simple Website Integration**: Embed your chatbot on any website with a single line of JavaScript. No complex setup required - just copy, paste, and your AI assistant is ready to help your visitors.

- **Self-Hosted & Open Source**: Host BotFusion on your own infrastructure for complete data privacy and control. Use your own API keys from OpenAI, Anthropic, Google, or other providers.

- **Advanced AI Capabilities**: Leverage state-of-the-art AI models to understand context, answer complex questions, and provide accurate information from your content. Support for multiple languages and query types.

- **Conversation Analytics**: Track and analyze user interactions with detailed metrics. Understand common questions, identify knowledge gaps, and continuously improve your chatbot's performance.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- An API key from one of the supported AI providers (OpenAI, Anthropic, Google, etc.)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/anands2959/botfusion.git
cd botfusion
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="your-database-connection-string"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

```

4. Initialize the database:

```bash
npx prisma db push
```

5. Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment

BotFusion can be deployed on any platform that supports Node.js applications:

- Self-hosted server
- Docker container
- Cloud platforms (AWS, Google Cloud, Azure, etc.)
- Vercel, Netlify, or similar services

For detailed deployment instructions, please refer to the [deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## How It Works

1. **Set Up Your Environment**: Deploy BotFusion on your own server or cloud infrastructure. Configure your preferred AI provider API keys for complete control over your data and costs.

2. **Connect Your Content Sources**: Import knowledge from your website URLs, upload PDF documents, or add content directly. The system processes and indexes everything into a searchable knowledge base.

3. **Customize Your Chatbot**: Design your chatbot's appearance to match your brand identity. Set your logo, color scheme, widget position, and conversation behavior for a seamless user experience.

4. **Embed and Monitor**: Add a single line of JavaScript to your website to activate your chatbot. Track conversations, analyze user questions, and continuously improve your knowledge base.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Tailwind CSS](https://tailwindcss.com/)
- Database ORM by [Prisma](https://www.prisma.io/)
- Authentication via [NextAuth.js](https://next-auth.js.org/)
