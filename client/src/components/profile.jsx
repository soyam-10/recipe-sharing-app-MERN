import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Camera, Mail, User, FileText } from "lucide-react";
import Loading from "./loading";
import { Link } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    profilePicture: "",
    bio: "",
    oldPassword: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState({});

  const getUserSession = useCallback(() => {
    const session = localStorage.getItem("session");
    return session ? JSON.parse(session) : null;
  }, []);

  const session = getUserSession();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(
          `http://localhost:5000/users/${session.user.id}`
        );
        const data = await response.json();
        if (data.success) {
          setUser(data.user || []);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data. Please try again.");
      }
    }
    fetchUserData();
  }, [session]);

  const validateProfileForm = () => {
    const newErrors = {};
    if (!profile.fullName) newErrors.fullName = "Full name is required";
    if (!profile.email) newErrors.email = "Email is required";
    return Object.keys(newErrors).length === 0 ? null : newErrors;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    if (!profile.oldPassword)
      newErrors.oldPassword = "Old password is required";
    if (!profile.newPassword)
      newErrors.newPassword = "New password is required";
    return Object.keys(newErrors).length === 0 ? null : newErrors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateProfileForm();
    if (!formErrors) {
      if (!session || !session.token) {
        toast.error("Please log in to update your profile.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/users/${session.user.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.token}`,
            },
            body: JSON.stringify(profile),
          }
        );
        if (!response.ok) throw new Error("Failed to update profile");
        toast.success("Profile updated successfully.");
        setUser(profile);
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again.");
      }
    } else {
      setErrors(formErrors);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validatePasswordForm();
    if (!formErrors) {
      if (!session || !session.token) {
        toast.error("Please log in to update your password.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/users/password/${session.user.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.token}`,
            },
            body: JSON.stringify({
              oldPassword: profile.oldPassword,
              newPassword: profile.newPassword,
            }),
          }
        );
        if (!response.ok) throw new Error("Failed to update password");
        toast.success("Password updated successfully.");
        setProfile((prev) => ({
          ...prev,
          oldPassword: "",
          newPassword: "",
        }));
      } catch (error) {
        console.error("Error updating password:", error);
        toast.error("Failed to update password. Please try again.");
      }
    } else {
      setErrors(formErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <Loading />;
  }
  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-8 backdrop-blur-2xl bg-white/20">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24 border-4 border-primary">
              <AvatarImage src={user.profilePicture} alt={user.fullName} />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-bold">
                {user.fullName}
              </CardTitle>
              <p>{user.email}</p>
              <Badge variant="outline" className="mt-2">
                {(user.role || "Member").toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>
            {user.bio || "No bio provided."}
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-center items-center m-2">
        {session.user.role == "cook" ? (
            <Button className="">
              <Link to="/recipeManagement">Manage your Recipes</Link>
            </Button>
        ) : (
          ""
        )}
        <Button><Link to="/favRecipes">View your favorite recipes.</Link></Button>
      </div>

      <Card className="backdrop-blur-2xl bg-white/20">
        <CardHeader>
          <CardTitle>Edit Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-base">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                required
                className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-destructive text-sm">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                required
                className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-destructive text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profilePicture" className="text-base">
                <Camera className="w-4 h-4 inline mr-2" />
                Profile Picture URL
              </Label>
              <Input
                id="profilePicture"
                name="profilePicture"
                type="url"
                value={profile.profilePicture}
                onChange={handleChange}
                className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                placeholder="Enter profile picture URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-base">
                <FileText className="w-4 h-4 inline mr-2" />
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                placeholder="Tell us about yourself"
              />
            </div>

            <Button type="submit" className="w-full bg-primary text-white">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-8 backdrop-blur-2xl bg-white/20">
        <CardHeader>
          <CardTitle>Change Your Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="oldPassword" className="text-base">
                Old Password
              </Label>
              <Input
                id="oldPassword"
                name="oldPassword"
                type="password"
                value={profile.oldPassword || ""}
                onChange={handleChange}
                required
                className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                placeholder="Enter your old password"
              />
              {errors.oldPassword && (
                <p className="text-destructive text-sm">{errors.oldPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-base">
                New Password
              </Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={profile.newPassword || ""}
                onChange={handleChange}
                required
                className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                placeholder="Enter your new password"
              />
              {errors.newPassword && (
                <p className="text-destructive text-sm">{errors.newPassword}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-primary text-white">
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
