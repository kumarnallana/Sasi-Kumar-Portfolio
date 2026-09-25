Nallana Sasi Kumar | Full-Stack Developer Portfolio

A full-stack developer portfolio designed and engineered as an interactive digital product rather than a conventional static portfolio.

The experience combines system-inspired visual design, 3D interactions, motion, live engineering data, project architecture, and production-focused performance.

Live

Live Demo: https://nallana-sasi-kumar-portfolio.vercel.app/
Repository: https://github.com/kumarnallana/Sasi-Kumar-Portfolio

Overview

I wanted my portfolio to represent more than a list of skills and projects.

The interface is built around a system-oriented visual language using blueprint-inspired layouts, technical typography, restrained motion, interactive depth, and a dark cyan-and-amber palette.

The goal is to communicate not only what I build, but how I think about engineering, product development, architecture, performance, and user experience.

Performance

Lighthouse performance results:

Device

Performance

Mobile

95

Desktop

100

Performance was treated as an engineering requirement alongside interaction design, responsiveness, and visual quality.

Core Experience

Interactive Technology Globe

A 3D technology visualization built with React Three Fiber that represents different areas of my stack and engineering experience.

It includes:

360-degree interaction

Technology nodes and constellations

Post-processing and bloom effects

Motion designed to support the interface rather than distract from it

System-Inspired Navigation

The portfolio uses an engineering-console-inspired interaction model with:

Depth-based navigation

Structured section transitions

GSAP animation sequencing

Smooth scrolling

Technical telemetry and interface details

Responsive behavior across desktop and mobile

Live GitHub Integration

GitHub data is integrated dynamically to surface:

Repositories

Stars

Followers

Profile information

Contribution history

Selectable contribution years

The integration uses GitHub APIs together with client-side data management for controlled fetching and caching.

Production Portfolio Analytics

Portfolio view information is retrieved from Vercel Web Analytics on the server.

The implementation intentionally avoids displaying fabricated fallback values. If authorized analytics data is unavailable, the interface reports the metric as unavailable instead of presenting misleading information.

Engineering Architecture

The portfolio also includes visual architecture and workflow representations for real engineering problems, including:

Frontend-to-backend request flows

API integrations

CRM workflows

Lead-generation systems

Application architecture

Deployment and delivery concepts

Technology Stack

Frontend

React.js

Next.js

TypeScript

HTML5

CSS3

Tailwind CSS

Motion and 3D

Three.js

React Three Fiber

GSAP

ScrollTrigger

Framer Motion

Lenis

Backend and APIs

Node.js

Express.js

Next.js Server Actions

REST APIs

GitHub GraphQL API

SQL

Browser Storage

Expanding Backend Stack

Python

FastAPI

Pydantic

SQLAlchemy

Data and Infrastructure

Supabase / PostgreSQL

Vercel Web Analytics

Vercel

GitHub APIs

Quality and Delivery

Git

GitHub

GitHub Actions

Jest

Postman

Responsive Design

Accessibility

Performance Optimization

Featured Engineering Work

Zylxy Technologies

Corporate Website and CRM Consulting Platform

Worked as a Web Developer Intern on a production-focused corporate website and CRM workflow.

Key contributions included:

Building reusable responsive UI components

Developing lead-generation workflows

Using Next.js Server Actions

Integrating REST APIs

Debugging frontend-to-backend data flows

Investigating CRM integration issues using browser developer tools

CoroVidya CSR Mentorship

Mentored more than 60 aspiring developers through:

JavaScript guidance

React concepts

Node.js fundamentals

Code reviews

Technical sessions

Development support

Engineering Principles

The portfolio reflects several principles I try to follow while building software:

Build systems, not isolated screens

Keep interfaces purposeful

Prefer real data over fabricated presentation

Treat responsiveness as part of the product

Optimize without sacrificing experience

Design motion with intent

Keep implementation understandable and maintainable

Open Source Signal Configuration

GitHub telemetry requires:

GITHUB_TOKEN=

Optional Vercel production analytics require:

VERCEL_ANALYTICS_TOKEN=
VERCEL_ANALYTICS_PROJECT_ID=
VERCEL_ANALYTICS_TEAM_ID=

The team ID is required only when the Vercel project belongs to a team.

Portfolio appreciation data uses Supabase/PostgreSQL and requires:

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

The service-role key remains server-side and is never exposed to the browser.

If analytics credentials are unavailable, the application preserves the interface without replacing missing metrics with fabricated values.

Connect

Portfolio:
https://nallana-sasi-kumar-portfolio.vercel.app/

LinkedIn:
https://www.linkedin.com/in/sasi-kumar-nallana

GitHub:
https://github.com/kumarnallana

Email:
sasikumarnallana956@gmail.com

Designed and developed by Nallana Sasi Kumar.
