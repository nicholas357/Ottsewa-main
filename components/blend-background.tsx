"use client"

export function BlendBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-zinc-900" />

      {/* Amber glow orbs - positioned for visual interest */}
      <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[120px]" />
      <div className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-amber-500/[0.025] rounded-full blur-[150px]" />
      <div className="absolute bottom-[20%] left-[30%] w-[400px] h-[400px] bg-amber-500/[0.02] rounded-full blur-[100px]" />
      <div className="absolute bottom-[5%] right-[25%] w-[350px] h-[350px] bg-amber-500/[0.025] rounded-full blur-[80px]" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  )
}
