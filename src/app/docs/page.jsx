"use client";
import Head from "next/head";
import Script from "next/script";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import swaggerConfig from "../swagger-config.json";
import { Inter } from "next/font/google";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const swaggerUIConfig = {
    defaultModelRendering: "model",
    docExpansion: "list", // Diubah agar terlihat lebih rapi saat load
    persistAuthorization: true,
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      /* Modern Background & Body */
      body {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        min-height: 100vh;
        margin: 0;
        font-family: 'Inter', sans-serif;
      }

      /* Container Card Styling */
      .swagger-ui {
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        border: 1px solid rgba(255,255,255,0.5);
        overflow: hidden;
      }

      /* Header / Info Section */
      .swagger-ui .info {
        margin: 0;
        padding: 30px 20px;
        background: #fff;
        border-bottom: 1px solid #eee;
      }

      .swagger-ui .info h1 {
        font-size: 32px;
        font-weight: 800;
        color: #10b981; /* Hijau Emerald Modern */
        margin-bottom: 10px;
        letter-spacing: -0.5px;
      }

      .swagger-ui .info p {
        font-size: 16px;
        color: #64748b;
        max-width: 600px;
        margin: 0 auto;
        line-height: 1.5;
      }

      /* Styling tombol & link */
      .swagger-ui .info a {
        color: #10b981;
        font-weight: 600;
        text-decoration: none;
        transition: color 0.2s;
      }
      
      .swagger-ui .info a:hover {
        color: #059669;
        text-decoration: underline;
      }

      /* Operation Blocks (Endpoints) */
      .swagger-ui .opblock {
        border-radius: 8px;
        margin-bottom: 12px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        border: 1px solid #e2e8f0;
        background: #fff;
      }

      .swagger-ui .opblock:hover {
        box-shadow: 0 8px 15px rgba(0,0,0,0.08);
        transform: translateY(-1px);
        transition: all 0.2s ease;
      }

      /* Tag Section Headers */
      .swagger-ui .opblock-tag {
        font-size: 20px;
        color: #1e293b;
        font-weight: 700;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 10px;
        margin-top: 20px;
      }

      /* Methods (GET, POST) */
      .swagger-ui .opblock-summary-method {
        border-radius: 6px;
        font-size: 13px;
        font-weight: 700;
        padding: 6px 15px;
        min-width: 70px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .swagger-ui .opblock-summary-method-get {
        background-color: #3b82f6; /* Biru */
        color: white;
      }

      .swagger-ui .opblock-summary-method-post {
        background-color: #10b981; /* Hijau */
        color: white;
      }

      .swagger-ui .opblock-summary-path {
        font-family: monospace;
        font-size: 15px;
        color: #334155;
        font-weight: 600;
        padding-left: 10px;
      }
      
      /* Try it out button styling */
      .swagger-ui .btn {
        background-color: #10b981;
        border-color: #10b981;
      }
      .swagger-ui .btn:hover {
        background-color: #059669;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Teguh API Documentation</title>
        <link rel="icon" href="/favicon.ico" /> 
        <meta name="title" content="Teguh API - Free REST API" />
        <meta name="description" content="Teguh API menyediakan layanan REST API gratis, cepat, dan tanpa limit untuk kebutuhan proyek Anda." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://teguhapi.vercel.app/" />
        <meta property="og:title" content="Teguh API - Documentation" />
        <meta property="og:description" content="Solusi API gratis, cepat, dan andal untuk developer Indonesia." />
        <meta property="og:image" content="/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Teguh API - Documentation" />
        <meta property="twitter:description" content="Solusi API gratis, cepat, dan andal." />
        <meta property="twitter:image" content="/og-image.png" />
      </Head>

      <Script
        id="ld-json-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "http://schema.org",
            "@type": "WebSite",
            "name": "Teguh API",
            "url": "https://teguhapi.vercel.app",
            "description": "Teguh API is a free, simple REST API for everyone.",
            "author": {
              "@type": "Person",
              "name": "Teguh"
            }
          }),
        }}
      />

      <main className={`p-4 md:p-10 ${inter.className}`}>
        <Analytics />
        <SpeedInsights />
        
        {/* Container Dokumentasi dengan Style Modern */}
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-2 md:p-6 border border-white/50">
          <SwaggerUI spec={swaggerConfig} {...swaggerUIConfig} />
        </div>
      </main>
    </>
  );
}
