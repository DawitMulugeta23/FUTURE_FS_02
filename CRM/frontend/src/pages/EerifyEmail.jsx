import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheckCircle, FiMail, FiXCircle } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { resendVerification, verifyEmail } from "../store/slices/authSlice";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (token) {
      verifyEmailToken();
    } else {
      setStatus("error");
      setMessage("No verification token provided");
    }
  }, [token]);

  const verifyEmailToken = async () => {
    try {
      const result = await dispatch(verifyEmail(token)).unwrap();
      if (result.success) {
        setStatus("success");
        setMessage(
          "Your email has been successfully verified! You can now log in to your account.",
        );
      } else {
        setStatus("error");
        setMessage(
          result.message ||
            "Verification failed. The link may be expired or invalid.",
        );
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        error ||
          "Verification failed. Please try again or request a new verification email.",
      );
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setResending(true);
    try {
      await dispatch(resendVerification(email)).unwrap();
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      console.error("Resend error:", error);
    } finally {
      setResending(false);
    }
  };

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-primary-600 rounded-full flex items-center justify-center animate-pulse">
              <FiMail className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Verifying Your Email
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we verify your email address...
          </p>
          <div className="mt-6">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center">
              <FiCheckCircle className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Email Verified!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-red-500 rounded-full flex items-center justify-center">
            <FiXCircle className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Verification Failed
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message ||
            "Unable to verify your email. The link may be expired or invalid."}
        </p>

        <div className="border-t dark:border-gray-700 pt-6 mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Didn't receive a verification email? Enter your email below to
            request a new one.
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 mb-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleResendVerification}
            disabled={resending}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors mb-3"
          >
            {resending ? "Sending..." : "Resend Verification Email"}
          </button>
          <Link
            to="/login"
            className="inline-block text-sm text-primary-600 hover:text-primary-700"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
