import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveGoogleToken, loadUser } from "../store/authSlice";
import toast from "react-hot-toast";

const AuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // 1. Save token to state + localStorage
      dispatch(saveGoogleToken(token));
      
      // 2. Load user details using the newly saved token
      dispatch(loadUser())
        .unwrap()
        .then(() => {
          toast.success("Successfully logged in with Google!");
          navigate("/");
        })
        .catch((err) => {
          console.error("Failed to load user details after OAuth callback:", err);
          toast.error("Google authentication failed. Please try again.");
          navigate("/login");
        });
    } else {
      toast.error("Authentication token missing.");
      navigate("/login");
    }
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg
          className="animate-spin h-8 w-8 text-orange-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-sm font-semibold text-stone-500 dark:text-stone-400">
          Syncing Google account details...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
