export const metadata = {
    title: 'DIY Ski Assessment',
    description: 'Ski and Snowboard Assessment System',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
