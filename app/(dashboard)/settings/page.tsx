"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="bg-transparent">
      <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

      <div className="rounded-2xl border border-white/[0.08] p-3">
        <div className="bg-[#0f0f0f] rounded-xl p-4 sm:p-6">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-[#1a1a1a] border border-white/[0.05]">
              <TabsTrigger
                value="profile"
                className="text-white data-[state=active]:bg-amber-500 data-[state=active]:text-black"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="text-white data-[state=active]:bg-amber-500 data-[state=active]:text-black"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="text-white data-[state=active]:bg-amber-500 data-[state=active]:text-black"
              >
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="bg-[#1a1a1a] border border-white/[0.05] rounded-xl p-4 sm:p-6">
                <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-zinc-300 mb-2 block">First Name</Label>
                      <Input
                        defaultValue="John"
                        className="bg-[#0f0f0f] border-white/[0.08] text-white focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <Label className="text-zinc-300 mb-2 block">Last Name</Label>
                      <Input
                        defaultValue="Doe"
                        className="bg-[#0f0f0f] border-white/[0.08] text-white focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-zinc-300 mb-2 block">Email</Label>
                    <Input
                      type="email"
                      defaultValue="john@example.com"
                      className="bg-[#0f0f0f] border-white/[0.08] text-white focus:border-amber-500"
                    />
                  </div>
                  <Button className="bg-amber-500 hover:bg-amber-600 text-black font-bold">Save Changes</Button>
                </div>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="bg-[#1a1a1a] border border-white/[0.05] rounded-xl p-4 sm:p-6">
                <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div>
                    <Label className="text-zinc-300 mb-2 block">Current Password</Label>
                    <Input
                      type="password"
                      className="bg-[#0f0f0f] border-white/[0.08] text-white focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <Label className="text-zinc-300 mb-2 block">New Password</Label>
                    <Input
                      type="password"
                      className="bg-[#0f0f0f] border-white/[0.08] text-white focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <Label className="text-zinc-300 mb-2 block">Confirm Password</Label>
                    <Input
                      type="password"
                      className="bg-[#0f0f0f] border-white/[0.08] text-white focus:border-amber-500"
                    />
                  </div>
                  <Button className="bg-amber-500 hover:bg-amber-600 text-black font-bold">Update Password</Button>
                </div>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <div className="bg-[#1a1a1a] border border-white/[0.05] rounded-xl p-4 sm:p-6">
                <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: "Email notifications", description: "Receive updates about your orders" },
                    { label: "Marketing emails", description: "Get deals and promotions" },
                    { label: "Newsletter", description: "Weekly gaming news and tips" },
                    { label: "Push notifications", description: "Mobile app notifications" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg border border-white/[0.05]"
                    >
                      <div>
                        <p className="text-white font-semibold">{item.label}</p>
                        <p className="text-zinc-500 text-sm">{item.description}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
