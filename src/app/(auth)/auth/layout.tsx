import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side – cover image */}
      <aside className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        <div className="absolute inset-0 tracking-[20rem]  drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
          <Image
            src="/auth/auth_33.png"
            alt=""
            fill
            className="object-cover "
            priority
          />
        </div>
      </aside>

      {/* Right side – auth forms (login, forgot-password, verify-email, reset-password) */}
      <main className="w-full lg:w-1/2 xl:w-[45%] flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 overflow-auto">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
