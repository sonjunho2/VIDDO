"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, Sparkles, Video, Mic, Captions, Wand2, Rocket, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const features = [
    { icon: <Sparkles className="w-6 h-6" />, title: "AI Script Generation", desc: "Turn your raw idea into a scroll-stopping video script instantly." },
    { icon: <Mic className="w-6 h-6" />, title: "AI Voiceover", desc: "Generate natural voiceovers for short-form and long-form videos." },
    { icon: <Captions className="w-6 h-6" />, title: "Auto Subtitles", desc: "Add bold, readable subtitles optimized for social platforms." },
    { icon: <Wand2 className="w-6 h-6" />, title: "Auto Editing", desc: "VIDDO combines visuals, voice, captions, and timing automatically." }
  ];

  const pricing = [
    { name: "Starter", price: "$19", desc: "For beginners testing AI video creation.", items: ["30 videos / month", "Short-form videos", "AI script", "AI voiceover", "Download videos"], featured: false },
    { name: "Creator", price: "$49", desc: "For creators who publish content every week.", items: ["150 videos / month", "Short & long-form videos", "Auto subtitles", "HD export", "Priority rendering"], featured: true },
    { name: "Pro", price: "$99", desc: "For serious creators and future brand campaigns.", items: ["500 videos / month", "Multi-platform ready", "Brand campaign access", "Advanced analytics", "Premium support"], featured: false }
  ];

  return (
    <div className="min-h-screen bg-[#070A12] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(139,92,246,0.24),_transparent_35%)]" />

      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Video className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tight">VIDDO</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-300">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#how" className="hover:text-white transition">How it works</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#" className="hover:text-white transition">Login</a>
        </nav>

        <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-5">Get Started</Button>
      </header>

      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-blue-200 mb-7">
              <Rocket className="w-4 h-4" /> AI Video Automation SaaS
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight mb-7">Create Viral Videos in Seconds with AI</h1>
            <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-xl mb-9">Turn any idea into ready-to-post videos with AI scripts, voiceovers, subtitles, and auto-editing.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button className="h-14 px-7 rounded-2xl bg-blue-500 hover:bg-blue-600 text-base font-bold shadow-xl shadow-blue-500/25">Get Started Free <ArrowRight className="w-5 h-5 ml-2" /></Button>
              <Button variant="outline" className="h-14 px-7 rounded-2xl border-white/15 bg-white/5 hover:bg-white/10 text-white text-base font-bold"><Play className="w-5 h-5 mr-2" /> Watch Demo</Button>
            </div>
            <div className="flex flex-wrap gap-5 text-sm text-zinc-300">
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> No editing skills</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> Fast video creation</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> Global creator tool</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }} className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-blue-500/20 to-violet-500/20 blur-3xl rounded-full" />
            <Card className="relative bg-[#0D1220]/90 border-white/10 rounded-3xl shadow-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div><p className="text-sm text-zinc-400">Create Video</p><h3 className="text-xl font-bold text-white">AI Video Studio</h3></div>
                  <div className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs border border-blue-400/20">Live Preview</div>
                </div>
                <div className="rounded-2xl bg-black/40 border border-white/10 p-4 mb-4"><label className="text-sm text-zinc-400">Your idea</label><div className="mt-2 rounded-xl bg-white/5 border border-white/10 p-4 text-zinc-200">Make a 30-second viral video about how AI helps small businesses grow.</div></div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4"><p className="text-xs text-zinc-400 mb-1">Style</p><p className="font-bold text-white">Marketing</p></div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4"><p className="text-xs text-zinc-400 mb-1">Length</p><p className="font-bold text-white">30 sec</p></div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4"><p className="text-xs text-zinc-400 mb-1">Voice</p><p className="font-bold text-white">Male</p></div>
                </div>
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-blue-500/30 via-violet-500/25 to-black border border-white/10 flex items-center justify-center mb-4"><div className="w-16 h-16 rounded-full bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur"><Play className="w-8 h-8 text-white ml-1" /></div></div>
                <Button className="w-full h-13 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 font-bold">Generate Video</Button>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section id="features" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-3xl mx-auto mb-12"><p className="text-blue-300 font-bold mb-3">FEATURES</p><h2 className="text-4xl md:text-5xl font-black mb-5">Everything you need to create videos faster</h2><p className="text-zinc-400 text-lg">VIDDO helps creators, marketers, and businesses produce ready-to-post videos without editing experience.</p></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">{features.map((feature) => (<Card key={feature.title} className="bg-white/[0.04] border-white/10 rounded-3xl hover:bg-white/[0.07] transition"><CardContent className="p-6"><div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-300 flex items-center justify-center mb-5">{feature.icon}</div><h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3><p className="text-zinc-400 leading-relaxed">{feature.desc}</p></CardContent></Card>))}</div>
        </section>

        <section id="how" className="max-w-7xl mx-auto px-6 py-20">
          <div className="rounded-[2rem] bg-white/[0.04] border border-white/10 p-8 md:p-12"><div className="text-center max-w-3xl mx-auto mb-12"><p className="text-blue-300 font-bold mb-3">HOW IT WORKS</p><h2 className="text-4xl md:text-5xl font-black mb-5">From idea to video in 3 steps</h2></div><div className="grid md:grid-cols-3 gap-6">{["Enter your idea", "Choose style & length", "Generate your video"].map((step, index) => (<div key={step} className="relative rounded-3xl bg-black/20 border border-white/10 p-7"><div className="text-5xl font-black text-blue-500/30 mb-6">0{index + 1}</div><h3 className="text-2xl font-bold mb-3">{step}</h3><p className="text-zinc-400">Simple controls designed for beginners and fast creators.</p></div>))}</div></div>
        </section>

        <section id="pricing" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-3xl mx-auto mb-12"><p className="text-blue-300 font-bold mb-3">PRICING</p><h2 className="text-4xl md:text-5xl font-black mb-5">Start simple. Scale when ready.</h2><p className="text-zinc-400 text-lg">Monthly plans for creators, businesses, and future brand campaign users.</p></div>
          <div className="grid lg:grid-cols-3 gap-6">{pricing.map((plan) => (<Card key={plan.name} className={`rounded-3xl border ${plan.featured ? "bg-blue-500/10 border-blue-400/40 shadow-2xl shadow-blue-500/20" : "bg-white/[0.04] border-white/10"}`}><CardContent className="p-7">{plan.featured && <div className="inline-block mb-4 px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-bold">MOST POPULAR</div>}<h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3><p className="text-zinc-400 mb-6">{plan.desc}</p><div className="mb-6"><span className="text-5xl font-black text-white">{plan.price}</span><span className="text-zinc-400"> / month</span></div><Button className={`w-full h-12 rounded-2xl mb-6 ${plan.featured ? "bg-blue-500 hover:bg-blue-600" : "bg-white/10 hover:bg-white/15"}`}>Choose Plan</Button><div className="space-y-3">{plan.items.map((item) => (<div key={item} className="flex items-center gap-3 text-zinc-300"><Check className="w-4 h-4 text-blue-400" />{item}</div>))}</div></CardContent></Card>))}</div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20 pb-28"><div className="rounded-[2rem] bg-gradient-to-r from-blue-600 to-violet-600 p-10 md:p-14 text-center shadow-2xl shadow-blue-500/20"><h2 className="text-4xl md:text-5xl font-black mb-5">Ready to create your first AI video?</h2><p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">Start with an idea. VIDDO turns it into a video you can post, test, and grow with.</p><Button className="h-14 px-8 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 text-base font-black">Get Started Free <ArrowRight className="w-5 h-5 ml-2" /></Button></div></section>
      </main>
    </div>
  );
}
