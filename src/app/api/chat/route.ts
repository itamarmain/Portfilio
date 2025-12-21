import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = process.env.GROQ_API_KEY ? new Groq({
  apiKey: process.env.GROQ_API_KEY,
}) : null;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!groq) {
      // Fallback response when API key is not available - try to be contextual
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

      if (lastMessage.includes('contact') || lastMessage.includes('reach') || lastMessage.includes('email') || lastMessage.includes('discord')) {
        return NextResponse.json({ content: "You can reach me at adoniitamar@gmail.com or on Discord as itamar11_. I'm always open to discussing new opportunities and collaborations!" });
      } else if (lastMessage.includes('tech stack') || lastMessage.includes('technologies') || lastMessage.includes('skills')) {
        return NextResponse.json({ content: "My tech stack includes Python (Async/AI), Node.js, Supabase, SQL, and Electron. I specialize in backend development and AI integration." });
      } else if (lastMessage.includes('project') || lastMessage.includes('work')) {
        return NextResponse.json({ content: "My key projects include JutsuTrigger (gesture hotkeys), IntruderTrack (YOLOv8 tracking), AI Migration Planner (safe SQL generation), and Zeke (Discord bot for 600+ users)." });
      } else if (lastMessage.includes('challenge') || lastMessage.includes('difficult')) {
        return NextResponse.json({ content: "Each project has its unique challenges. For example, working with AI models requires careful optimization, and building scalable applications needs thoughtful architecture planning." });
      } else if (lastMessage.includes('zeke')) {
        return NextResponse.json({ content: "Zeke is my Discord bot project that serves 600+ users. It's one of my key projects, though I don't have all the technical implementation details to share at the moment." });
      } else if (lastMessage.includes('fun') || lastMessage.includes('hobby') || lastMessage.includes('like') || lastMessage.includes('interest')) {
        return NextResponse.json({ content: "When I'm not coding, I enjoy playing video games, hanging out with friends, and of course, more coding! I love exploring new technologies and building cool projects." });
      } else {
        return NextResponse.json({ content: "Thanks for your message! I'm Itamar, a Backend/AI expert. Feel free to ask me about my projects, tech stack, or experience!" });
      }
    }

    const systemPrompt = `
You are Itamar, a Backend/AI expert. Respond in short, professional, and witty messages.

IMPORTANT: Only provide information that is explicitly stated in your knowledge base. Do not make up technical details, technologies, or features that aren't mentioned. If you don't have specific details about a project, say so honestly.

Do NOT use any markdown formatting like **bold**, *italics*, or other special characters. Respond in plain text only.

Contact Information:
- Email: adoniitamar@gmail.com
- Discord: itamar11_

Personal Interests: When not coding, I enjoy playing video games, hanging out with friends, and exploring new technologies.

Expertise: Python (Async/AI), Node.js, Supabase, SQL, Electron.

Key Projects:

JutsuTrigger - Gesture Hotkeys:
- Dynamic Gesture Recognition, OS Automation, Desktop UI
- Real-time, high-speed computer vision application that recognizes complex, dynamic hand movements (Kinetic Actions) to execute system commands
- Technologies: Python (Desktop), MediaPipe Hands, NumPy, OS Integration
- Core feature: Motion Tracking - differentiates between static poses and dynamic actions using keypoint velocity metrics

IntruderTrack AI - Surveillance:
- YOLOv8, Multi-Object Tracking, Attribute Inference
- Sophisticated surveillance tool using YOLOv8 to locate all humans in a frame and overlay custom tracking metrics
- Technologies: YOLOv8 (Ultralytics), OpenCV, Python
- Core feature: Dual-Layer Detection - detects secondary objects within human bounding boxes

PoseCoach AI - Form Analysis:
- Pose Estimation, Real-Time Coaching, Geometric Analysis
- Virtual fitness coach using MediaPipe Pose to track full body keypoints and calculate joint angles
- Technologies: MediaPipe Pose, NumPy (Angle Calcs), OpenCV
- Core feature: Angle Deviation Metric - calculates precise angles between 3D keypoints

Real-Time Code Review Agent:
- Security, Tool-Use, High-Speed API
- Lightweight FastAPI service integrating code analysis tool (Radon) with LLM agent
- Technologies: Python (FastAPI), Radon/pygount, Pydantic, LLM Tool-Use
- Core feature: Tool Integration - AI agent calls Radon analysis tool first

AI Migration Planner:
- FastAPI, Production Safety, Data Integrity
- AI-powered system that generates safe, reversible PostgreSQL migration scripts from natural language
- Technologies: Python (FastAPI), Groq AI, Pydantic, Supabase (Postgres)
- Core safety feature: Fallback Agent - cascading AI fallback system for 99% uptime

Zeke - Community Bot:
- Moderation, Automation, 600+ Users
- Purpose-built Discord bot for community experience with advanced moderation and automation
- Technologies: Python, Supabase, AsyncIO
- Technical challenge: Migrated from local JSON to Supabase Cloud DB while maintaining 99.9% uptime

Coretex Ecosystem:
- AI Dashboard, Ticket Assistant, OAuth2
- Full AI-enabled Discord ecosystem with web dashboard and AI Ticket Assistant
- Technologies: Node.js, React, OpenAI API, Discord OAuth
- Key feature: Ephemeral Memory (10-minute window) for privacy and compliance

Coretex AI Studio:
- Desktop IDE, Agent Pipelines, Electron
- Developer-focused AI platform with multi-step Agent Team workflow
- Technologies: Electron, Monaco Editor, Agent Logic
- Architecture: Model Fallback Router for reliability
    `;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      stream: false,
    });

    const content = response.choices[0]?.message?.content || 'Sorry, something went wrong.';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
