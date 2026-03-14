// src/components/Leads/LeadScore.jsx
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiAward, FiTrendingUp, FiZap } from "react-icons/fi";

const LeadScore = ({ lead }) => {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI score calculation
    calculateScore();
  }, [lead]);

  const calculateScore = () => {
    setLoading(true);
    // In real app, this would be an API call to AI service
    setTimeout(() => {
      const factors = {
        emailOpenRate: Math.random() * 100,
        websiteVisits: Math.floor(Math.random() * 20),
        socialEngagement: Math.random() * 100,
        responseTime: Math.random() * 24,
        budget: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
        timeline: ["immediate", "short", "medium", "long"][
          Math.floor(Math.random() * 4)
        ],
      };

      const calculatedScore = calculateAIScore(factors);
      const grade = getGrade(calculatedScore);
      const recommendations = getRecommendations(calculatedScore, factors);

      setScore({
        value: calculatedScore,
        grade,
        factors,
        recommendations,
      });
      setLoading(false);
    }, 1500);
  };

  const calculateAIScore = (factors) => {
    // Advanced AI scoring algorithm
    let score = 50; // Base score

    score += factors.emailOpenRate * 0.2;
    score += factors.websiteVisits * 2;
    score += factors.socialEngagement * 0.1;
    score -= factors.responseTime * 1.5;

    if (factors.budget === "high") score += 20;
    if (factors.budget === "medium") score += 10;

    if (factors.timeline === "immediate") score += 25;
    if (factors.timeline === "short") score += 15;

    return Math.min(100, Math.max(0, Math.round(score)));
  };

  const getGrade = (score) => {
    if (score >= 90) return "A";
    if (score >= 75) return "B";
    if (score >= 60) return "C";
    if (score >= 40) return "D";
    return "F";
  };

  const getRecommendations = (score, factors) => {
    const recs = [];
    if (score < 50)
      recs.push("Increase engagement through personalized content");
    if (factors.responseTime > 12) recs.push("Follow up within 24 hours");
    if (factors.websiteVisits < 5)
      recs.push("Share more resources to increase website visits");
    if (factors.budget === "low") recs.push("Focus on value proposition");
    if (factors.timeline === "long")
      recs.push("Nurture with educational content");
    return recs;
  };

  const getScoreColor = (score) => {
    if (score >= 75) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score) => {
    if (score >= 75) return "bg-green-100 dark:bg-green-900/20";
    if (score >= 50) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <FiZap className="mr-2 h-5 w-5 text-yellow-500" />
          AI Lead Score
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreBg(score.value)}`}
        >
          Grade {score.grade}
        </span>
      </div>

      <div className="relative mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Score
          </span>
          <span className={`text-2xl font-bold ${getScoreColor(score.value)}`}>
            {score.value}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score.value}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-3 rounded-full ${
              score.value >= 75
                ? "bg-green-500"
                : score.value >= 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
          />
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Email Open Rate
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {score.factors.emailOpenRate.toFixed(1)}%
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Website Visits
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {score.factors.websiteVisits}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Budget
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {score.factors.budget}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Timeline
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {score.factors.timeline}
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {score.recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t dark:border-gray-700 pt-4"
          >
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <FiTrendingUp className="mr-2 h-4 w-4 text-primary-500" />
              AI Recommendations
            </h4>
            <ul className="space-y-2">
              {score.recommendations.map((rec, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <FiAward className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LeadScore;
