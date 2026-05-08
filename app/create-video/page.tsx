"use client";

import VideoRenderer from "@/components/VideoRenderer";
import SubtitleGenerator from "@/components/SubtitleGenerator";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, Mic, Music, Trash2, Wand2, Clapperboard, Images, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateVideoPage() {
const fileInputRef = useRef<HTMLInputElement | null>(null);

const [idea, setIdea] = useState("");
const [script, setScript] = useState("");
const [audioUrl, setAudioUrl] = useState("");
const [uploadedImages, setUploadedImages] = useState<File[]>([]);
const [imagePreviews, setImagePreviews] = useState<string[]>([]);
const [analysis, setAnalysis] = useState("");
const [scenes, setScenes] = useState("");
const [sceneImage, setSceneImage] = useState("");
const [motionVideo, setMotionVideo] = useState("");
const [analysisLoading, setAnalysisLoading] = useState(false);
const [sceneLoading, setSceneLoading] = useState(false);
const [sceneImageLoading, setSceneImageLoading] = useState(false);
const [motionLoading, setMotionLoading] = useState(false);
const [loading, setLoading] = useState(false);
const [voiceLoading, setVoiceLoading] = useState(false);
const [error, setError] = useState("");

function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
const files = Array.from(event.target.files || []);
if (!files.length) return;
const newPreviews = files.map((file) => URL.createObjectURL(file));
setUploadedImages((prev) => [...prev, ...files]);
setImagePreviews((prev) => [...prev, ...newPreviews]);
}

function removeImage(index:number){
setUploadedImages((prev)=>prev.filter((_,i)=>i!==index));
setImagePreviews((prev)=>prev.filter((_,i)=>i!==index));
}

async function analyzeImages(){
if(imagePreviews.length===0) return;
setAnalysisLoading(true);
try{
const res = await fetch('/api/analyze-images',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({images:imagePreviews,prompt:idea})
});
const data = await res.json();
setAnalysis(data.analysis || 'No analysis returned');
}catch(e){
setError('Image analysis failed');
}
finally{
setAnalysisLoading(false);
}
}

async function generateScenes(){
if(!analysis) return;
setSceneLoading(true);
try{
const res = await fetch('/api/generate-scenes',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
idea,
analysis,
platform:'TikTok',
length:'30 sec'
})
});

const data = await res.json();
setScenes(data.scenes || 'No scenes generated');
}catch(e){
setError('Scene generation failed');
}
finally{
setSceneLoading(false);
}
}

async function generateSceneImages(){
if(!scenes) return;
setSceneImageLoading(true);
try{
const res = await fetch('/api/generate-scene-images-batch',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({scenes})
});

const data = await res.json();

if(data.imageBase64){
setSceneImage(`data:image/png;base64,${data.imageBase64}`);
}
}catch(e){
setError('Scene image generation failed');
}
finally{
setSceneImageLoading(false);
}
}

async function generateMotionVideo(){
if(!sceneImage) return;
setMotionLoading(true);
try{
const res = await fetch('/api/generate-motion-video',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
image:sceneImage,
prompt:scenes
})
});

const data = await res.json();
setMotionVideo(data.previewVideo || '');
}catch(e){
setError('Motion video generation failed');
}
finally{
setMotionLoading(false);
}
}

async function handleGenerateScript(){
setLoading(true);
try{
const res = await fetch('/api/generate-script',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({idea})
});
const data = await res.json();
setScript(data.script || '');
}catch(e){
setError('Script generation failed');
}
finally{
setLoading(false);
}
}

async function handleGenerateVoice(){
setVoiceLoading(true);
try{
const res = await fetch('/api/generate-voice',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({script,voice:'Male'})
});
const data = await res.json();
setAudioUrl(data.audioUrl || '');
}catch(e){
setError('Voice generation failed');
}
finally{
setVoiceLoading(false);
}
}

return (
<main className="min-h-screen bg-[#070A12] text-white p-6">
<div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
<Card className="bg-white/[0.04] border-white/10 rounded-3xl">
<CardContent className="p-6 space-y-5">
<div>
<h1 className="text-4xl font-black mb-2">VIDDO AI Studio</h1>
<p className="text-zinc-400">AI cinematic video generation pipeline.</p>
</div>

<textarea
value={idea}
onChange={(e)=>setIdea(e.target.value)}
placeholder="Describe your AI video idea..."
className="w-full min-h-[140px] rounded-2xl bg-black/30 border border-white/10 p-4"
/>

<div>
<div onClick={()=>fileInputRef.current?.click()} className="rounded-3xl border border-dashed border-white/15 p-6 text-center cursor-pointer">
<input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
<ImagePlus className="w-10 h-10 mx-auto mb-3 text-blue-300" />
<p className="font-bold">Upload Multiple Images</p>
</div>

{imagePreviews.length > 0 && (
<div className="grid grid-cols-3 gap-3 mt-4">
{imagePreviews.map((preview,index)=>(
<div key={index} className="relative">
<img src={preview} className="w-full h-32 object-cover rounded-xl" />
<button onClick={()=>removeImage(index)} className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
<Trash2 className="w-4 h-4" />
</button>
</div>
))}
</div>
)}
</div>

<Button onClick={analyzeImages} disabled={analysisLoading || imagePreviews.length===0} className="w-full rounded-2xl bg-emerald-500 hover:bg-emerald-600">
{analysisLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing Images...</> : 'Analyze Uploaded Images'}
</Button>

<Button onClick={generateScenes} disabled={sceneLoading || !analysis} className="w-full rounded-2xl bg-orange-500 hover:bg-orange-600">
{sceneLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating Scenes...</> : <><Clapperboard className="w-4 h-4 mr-2" />Generate Cinematic Scenes</>}
</Button>

<Button onClick={generateSceneImages} disabled={sceneImageLoading || !scenes} className="w-full rounded-2xl bg-pink-500 hover:bg-pink-600">
{sceneImageLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating AI Scene Images...</> : <><Images className="w-4 h-4 mr-2" />Generate AI Scene Images</>}
</Button>

<Button onClick={generateMotionVideo} disabled={motionLoading || !sceneImage} className="w-full rounded-2xl bg-cyan-500 hover:bg-cyan-600">
{motionLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating Motion Video...</> : <><Film className="w-4 h-4 mr-2" />Generate Motion Video</>}
</Button>

<Button onClick={handleGenerateScript} disabled={loading} className="w-full rounded-2xl bg-blue-500 hover:bg-blue-600">
{loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating Script...</> : <><Wand2 className="w-4 h-4 mr-2" />Generate Script</>}
</Button>

{error && <div className="text-red-300 text-sm">{error}</div>}
</CardContent>
</Card>

<div className="space-y-6">
<Card className="bg-[#0D1220]/90 border-white/10 rounded-3xl">
<CardContent className="p-6 space-y-4">
<h2 className="text-2xl font-black">AI Image Analysis</h2>
<div className="rounded-2xl bg-black/30 border border-white/10 p-4 whitespace-pre-wrap min-h-[180px] text-zinc-300">
{analysis || 'Uploaded image analysis will appear here.'}
</div>
</CardContent>
</Card>

<Card className="bg-[#0D1220]/90 border-white/10 rounded-3xl">
<CardContent className="p-6 space-y-4">
<h2 className="text-2xl font-black">AI Cinematic Scenes</h2>
<div className="rounded-2xl bg-black/30 border border-white/10 p-4 whitespace-pre-wrap min-h-[260px] text-zinc-300">
{scenes || 'Generated cinematic scenes will appear here.'}
</div>
</CardContent>
</Card>

<Card className="bg-[#0D1220]/90 border-white/10 rounded-3xl">
<CardContent className="p-6 space-y-4">
<h2 className="text-2xl font-black">AI Scene Preview</h2>

{sceneImage ? (
<img src={sceneImage} className="w-full rounded-2xl border border-white/10" />
) : (
<div className="rounded-2xl bg-black/30 border border-white/10 p-4 min-h-[260px] flex items-center justify-center text-zinc-500">
AI generated cinematic scene images will appear here.
</div>
)}
</CardContent>
</Card>

<Card className="bg-[#0D1220]/90 border-white/10 rounded-3xl">
<CardContent className="p-6 space-y-4">
<h2 className="text-2xl font-black">Motion Video Preview</h2>

{motionVideo ? (
<video controls className="w-full rounded-2xl border border-white/10">
<source src={motionVideo} type="video/mp4" />
</video>
) : (
<div className="rounded-2xl bg-black/30 border border-white/10 p-4 min-h-[260px] flex items-center justify-center text-zinc-500">
AI motion video preview will appear here.
</div>
)}
</CardContent>
</Card>

<Card className="bg-[#0D1220]/90 border-white/10 rounded-3xl">
<CardContent className="p-6 space-y-4">
<h2 className="text-2xl font-black">Generated Script</h2>
<div className="rounded-2xl bg-black/30 border border-white/10 p-4 whitespace-pre-wrap min-h-[220px] text-zinc-300">
{script || 'Generated script will appear here.'}
</div>

<Button onClick={handleGenerateVoice} disabled={voiceLoading || !script} className="rounded-2xl bg-violet-500 hover:bg-violet-600">
{voiceLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating Voice...</> : <><Music className="w-4 h-4 mr-2" />Generate Voice</>}
</Button>

{audioUrl && <audio controls src={audioUrl} className="w-full" />}

<SubtitleGenerator script={script} />

<VideoRenderer script={script} audioUrl={audioUrl} platform="TikTok" length="30 sec" />
</CardContent>
</Card>
</div>
</div>
</main>
);
}
