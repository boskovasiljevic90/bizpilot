// pages/dashboard.tsx
import { useState } from "react";

export default function Dashboard() {
  const [post, setPost] = useState("");
  const [tone, setTone] = useState("friendly");
  const [review, setReview] = useState("");
  const [reply, setReply] = useState("");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-extrabold">
            need<span className="text-teal-300">AI</span>.help
          </span>
          <span className="text-slate-400">BizPilot</span>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-8 grid md:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold">Draft a social post</h2>
          <textarea
            value={post}
            onChange={(e) => setPost(e.target.value)}
            placeholder="What do you want to say? e.g. 'New 10% winter discount on car wash'"
            className="mt-3 w-full h-32 bg-transparent rounded-lg border border-white/10 p-3"
          />
          <label className="mt-3 block text-sm text-slate-400">Tone</label>
          <select
            className="mt-1 w-full bg-transparent rounded-lg border border-white/10 p-2"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
            <option value="funny">Funny</option>
          </select>
          <button
            className="mt-4 px-4 py-2 rounded-lg bg-teal-500 text-slate-900 font-semibold hover:bg-teal-400"
            onClick={() => alert(`(Demo) Drafting a ${tone} post:\n\n${post}`)}
          >
            Draft with AI (Demo)
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold">Reply to a review</h2>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Paste a customer review here..."
            className="mt-3 w-full h-32 bg-transparent rounded-lg border border-white/10 p-3"
          />
          <button
            className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
            onClick={() =>
              setReply(
                `(Demo) Thanks for your review! We appreciate your feedback and hope to see you again soon.`
              )
            }
          >
            Suggest Reply
          </button>
          {reply && (
            <pre className="mt-4 text-sm whitespace-pre-wrap bg-black/30 rounded-lg p-3 border border-white/10">
              {reply}
            </pre>
          )}
        </div>
      </section>
    </main>
  );
}
