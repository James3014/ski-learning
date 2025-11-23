import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background-light dark:bg-background-dark">
      <div className="text-center">
        <div className="mb-6">
          <span className="material-symbols-outlined text-green-500 text-6xl">
            check_circle
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
          認領成功！
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          您的課程席位已成功認領，我們會透過 Email 通知您後續資訊。
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-bold hover:opacity-90 transition"
        >
          返回首頁
        </Link>
      </div>
    </div>
  )
}
