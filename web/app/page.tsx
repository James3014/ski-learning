import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-8">
        DIY Ski Assessment System
      </h1>
      <div className="flex flex-col gap-4">
        <Link 
          href="/claim"
          className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:opacity-90 transition"
        >
          認領課程席位
        </Link>
        <Link 
          href="/abilities"
          className="px-6 py-3 bg-slate-700 text-white rounded-lg font-bold hover:opacity-90 transition"
        >
          查看能力清單
        </Link>
      </div>
    </div>
  )
}
