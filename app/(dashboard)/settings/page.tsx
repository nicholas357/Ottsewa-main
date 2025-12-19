"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-purple-800">
          <TabsTrigger value="profile" className="text-white">
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="text-white">
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-white">
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="bg-purple-900/50 border-purple-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">First Name</Label>
                  <Input defaultValue="John" className="bg-purple-800 border-purple-700 text-white" />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Last Name</Label>
                  <Input defaultValue="Doe" className="bg-purple-800 border-purple-700 text-white" />
                </div>
              </div>
              <div>
                <Label className="text-white mb-2 block">Email</Label>
                <Input
                  type="email"
                  defaultValue="john@example.com"
                  className="bg-purple-800 border-purple-700 text-white"
                />
              </div>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="bg-purple-900/50 border-purple-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>
            <div className="space-y-6">
              <div>
                <Label className="text-white mb-2 block">Current Password</Label>
                <Input type="password" className="bg-purple-800 border-purple-700 text-white" />
              </div>
              <div>
                <Label className="text-white mb-2 block">New Password</Label>
                <Input type="password" className="bg-purple-800 border-purple-700 text-white" />
              </div>
              <div>
                <Label className="text-white mb-2 block">Confirm Password</Label>
                <Input type="password" className="bg-purple-800 border-purple-700 text-white" />
              </div>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">Update Password</Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="bg-purple-900/50 border-purple-700 p-6">
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
                  className="flex items-center justify-between p-4 bg-purple-800/30 rounded-lg border border-purple-700"
                >
                  <div>
                    <p className="text-white font-semibold">{item.label}</p>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
