'use client';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="ja">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <p className="text-gray-600">予期しないエラーが発生しました。</p>
          <button
            onClick={reset}
            className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-600"
          >
            再試行
          </button>
        </div>
      </body>
    </html>
  );
}
