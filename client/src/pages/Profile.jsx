import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Shield, Camera, Edit2, Check, X, LogOut, Heart, MessageSquare, History } from "lucide-react";
import toast from "react-hot-toast";
import { logout, updateProfileThunk } from "../store/authSlice";
import { fetchRecentlyViewed } from "../store/recipeSlice";
import API from "../api/axios";
import RecipeCard from "../components/recipe/RecipeCard";
import { RecipeGridSkeleton } from "../components/recipe/RecipeSkeleton";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { token, user, isLoading: authLoading } = useSelector((state) => state.auth);
  const { recentlyViewed, isLoading: recipesLoading } = useSelector((state) => state.recipes);

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [reviewsCount, setReviewsCount] = useState(0);

  // Load recently viewed details & reviews count on mount
  useEffect(() => {
    if (token) {
      dispatch(fetchRecentlyViewed());
      
      // Fetch user reviews count
      API.get("/reviews/user/count")
        .then((res) => {
          setReviewsCount(res.data.count || 0);
        })
        .catch((err) => {
          console.error("Failed to load reviews count:", err);
        });
    }
  }, [dispatch, token]);

  // Sync edit name state when user data changes
  useEffect(() => {
    if (user?.name) {
      setNewName(user.name);
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    toast.success("Successfully logged out");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image file must be less than 3MB");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    const uploadPromise = dispatch(updateProfileThunk(formData)).unwrap();
    toast.promise(uploadPromise, {
      loading: "Uploading avatar...",
      success: "Avatar updated successfully!",
      error: "Failed to upload avatar",
    });
  };

  const handleRemoveAvatar = () => {
    const formData = new FormData();
    formData.append("removeAvatar", "true");

    const removePromise = dispatch(updateProfileThunk(formData)).unwrap();
    toast.promise(removePromise, {
      loading: "Removing avatar...",
      success: "Avatar removed successfully!",
      error: "Failed to remove avatar",
    });
  };

  const handleSaveName = () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      toast.error("Name cannot be empty");
      return;
    }
    if (trimmed === user.name) {
      setIsEditingName(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", trimmed);

    dispatch(updateProfileThunk(formData))
      .unwrap()
      .then(() => {
        toast.success("Name updated successfully!");
        setIsEditingName(false);
      })
      .catch((err) => {
        toast.error(err || "Failed to update profile name");
      });
  };

  // If not authenticated, render blurred overlay (handled globally)
  if (!token || !user) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh] filter blur-[3px] pointer-events-none select-none">
        <h2 className="text-xl font-bold">Please login to view your profile</h2>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="container mx-auto px-4 py-8 space-y-10 pb-20 min-h-screen"
    >
      {/* 1. Header Banner & Profile Details Card */}
      <section className="relative bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-850 rounded-3xl overflow-hidden shadow-sm p-8">
        
        {/* Colorful Gradient Header Strip */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 opacity-90" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 pt-12">
          {/* Avatar Section */}
          <div className="relative group cursor-pointer">
            {/* Avatar Circle Container */}
            <div onClick={handleAvatarClick} className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-stone-900 bg-stone-100 dark:bg-stone-800 shadow-lg group">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover animate-fade-in" />
              ) : (
                <div className="w-full h-full bg-orange-500 text-white flex items-center justify-center text-3xl font-black">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              {/* Hover Camera icon overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6" />
              </div>
            </div>

            {/* Remove Avatar Floating Button */}
            {user.avatar && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveAvatar();
                }}
                className="absolute -top-1 -right-1 z-20 w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md active:scale-95 transition-all border-2 border-white dark:border-stone-900 hover:scale-105"
                title="Remove profile picture"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          {/* Account Details Name/Email */}
          <div className="flex-1 text-center md:text-left space-y-2 pb-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              {isEditingName ? (
                <div className="flex items-center gap-2 max-w-sm mx-auto md:mx-0">
                  <Input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="rounded-xl border-stone-300 dark:border-stone-800 focus-visible:ring-orange-500 h-9 font-bold bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-100"
                  />
                  <Button onClick={handleSaveName} className="h-9 w-9 p-0 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => { setIsEditingName(false); setNewName(user.name); }} variant="outline" className="h-9 w-9 p-0 rounded-xl border-orange-100 dark:border-stone-800">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h2 className="text-2xl font-black text-stone-850 dark:text-white">
                    {user.name}
                  </h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-stone-400 hover:text-orange-500 p-1 rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm font-semibold text-stone-450 dark:text-stone-500">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-orange-500" />
                {user.email}
              </span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-orange-500" />
                Chef Member
              </span>
            </div>
          </div>

          {/* Action Log Out */}
          <div className="pb-2">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="rounded-xl font-bold border-red-250 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/10 dark:text-red-400 bg-white dark:bg-stone-900 gap-2 h-10 shadow-sm active:scale-95 transition-transform"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Stats Section Cards */}
      <section className="grid grid-cols-2 gap-6">
        {/* Saved Count */}
        <div className="bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-850 p-6 rounded-3xl shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-orange-100/60 dark:bg-orange-950/30 rounded-2xl flex items-center justify-center text-orange-500">
            <Heart className="w-6 h-6 fill-orange-500/20" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest block">Saved Recipes</span>
            <span className="text-xl font-black text-stone-800 dark:text-white">
              {user.savedRecipes?.length || 0} recipes
            </span>
          </div>
        </div>

        {/* Reviews Left */}
        <div className="bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-850 p-6 rounded-3xl shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-orange-100/60 dark:bg-orange-950/30 rounded-2xl flex items-center justify-center text-orange-500">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest block">Reviews Written</span>
            <span className="text-xl font-black text-stone-800 dark:text-white">
              {reviewsCount} reviews
            </span>
          </div>
        </div>
      </section>

      {/* 3. Recently Viewed Recipe Grid Row */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-orange-500" />
          <h3 className="text-xl md:text-2xl font-black text-stone-850 dark:text-white">
            Recently Viewed Recipes
          </h3>
        </div>

        {recipesLoading ? (
          <RecipeGridSkeleton count={4} />
        ) : recentlyViewed.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-850 rounded-3xl px-6 shadow-sm">
            <div className="w-12 h-12 bg-orange-50 dark:bg-stone-955 rounded-full flex items-center justify-center text-orange-500 mx-auto mb-4">
              <History className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-stone-850 dark:text-stone-150">
              No recent view history
            </h4>
            <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 mt-1 max-w-xs mx-auto">
              Your viewing history is currently empty. Recipes you open will show up here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-1">
            {recentlyViewed.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default Profile;
