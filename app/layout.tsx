import type { Metadata } from 'next'
import { Provider } from '@/components/ui/provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Timezone Watches',
  description: 'Compare your local time with US timezones',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
