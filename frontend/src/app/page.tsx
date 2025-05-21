import Link from 'next/link'

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6"
                        >
                            <path d="M18 7V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v3" />
                            <path d="M18 14v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3" />
                            <rect width="18" height="10" x="3" y="7" rx="2" />
                        </svg>
                        <span className="text-xl font-bold">WalletApp</span>
                    </div>
                    <nav className="flex gap-4">
                        <Link
                            href="/login"
                            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                            Register
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                        Manage Your Money with Ease
                                    </h1>
                                    <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                        A secure wallet application that lets you fund your wallet, view your balance, and track your
                                        transaction history.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link
                                        href="/register"
                                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        Get Started
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        Login
                                    </Link>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="relative h-[350px] w-[350px] rounded-lg bg-gradient-to-b from-primary/20 to-primary/5 p-6">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="space-y-2 text-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="mx-auto h-12 w-12 text-primary"
                                            >
                                                <rect width="20" height="14" x="2" y="5" rx="2" />
                                                <line x1="2" x2="22" y1="10" y2="10" />
                                            </svg>
                                            <h3 className="text-xl font-bold">Secure Wallet</h3>
                                            <p className="text-sm text-gray-500">
                                                Fund your wallet, track transactions, and manage your finances in one place.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
                    <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-3 lg:gap-10">
                        <div className="space-y-2">
                            <div className="inline-block rounded-lg bg-primary p-2 text-primary-foreground">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-6 w-6"
                                >
                                    <path d="M20 7h-9" />
                                    <path d="M14 17H5" />
                                    <circle cx="17" cy="17" r="3" />
                                    <circle cx="7" cy="7" r="3" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">Fund Your Wallet</h3>
                            <p className="text-gray-500">Easily add funds to your wallet using various payment methods.</p>
                        </div>
                        <div className="space-y-2">
                            <div className="inline-block rounded-lg bg-primary p-2 text-primary-foreground">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-6 w-6"
                                >
                                    <rect width="20" height="14" x="2" y="5" rx="2" />
                                    <line x1="2" x2="22" y1="10" y2="10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">View Balance</h3>
                            <p className="text-gray-500">Check your current wallet balance at any time.</p>
                        </div>
                        <div className="space-y-2">
                            <div className="inline-block rounded-lg bg-primary p-2 text-primary-foreground">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-6 w-6"
                                >
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">Transaction History</h3>
                            <p className="text-gray-500">View your complete transaction history with detailed information.</p>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 px-4 md:h-16 md:flex-row md:px-6">
                    <p className="text-sm text-gray-500">© 2024 WalletApp. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="#" className="text-sm text-gray-500 hover:underline">
                            Terms
                        </Link>
                        <Link href="#" className="text-sm text-gray-500 hover:underline">
                            Privacy
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
