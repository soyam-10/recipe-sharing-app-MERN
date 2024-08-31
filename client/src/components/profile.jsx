"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Profile() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [profilePicUrl, setProfilePicUrl] = useState("https://github.com/shadcn.png")
  const [bio, setBio] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log({ fullName, email, password, profilePicUrl, bio })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto bg-gray-50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-6">
            <Avatar className="w-24 h-24 bg-gray-200">
              <AvatarImage src={profilePicUrl} alt={fullName} />
              <AvatarFallback className="text-gray-600">{fullName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor="profilePicUrl" className="text-gray-700">Profile Picture URL</Label>
              <Input
                id="profilePicUrl"
                value={profilePicUrl}
                onChange={(e) => setProfilePicUrl(e.target.value)}
                placeholder="https://example.com/profile-pic.jpg"
                className="bg-white border-gray-300"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="bg-white border-gray-300"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@example.com"
              className="bg-white border-gray-300"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-700">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white border-gray-300"
            />
          </div>
          <div>
            <Label htmlFor="bio" className="text-gray-700">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              className="min-h-[100px] bg-white border-gray-300"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full bg-blue-500 text-white hover:bg-blue-600">Save Changes</Button>
      </CardFooter>
    </Card>
  )
}
