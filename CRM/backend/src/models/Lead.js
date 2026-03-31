const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Please add note content"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const leadSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please add first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please add last name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add email"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    company: {
      type: String,
      trim: true,
      default: "",
    },
    source: {
      type: String,
      enum: [
        "website",
        "referral",
        "social_media",
        "email_campaign",
        "advertisement",
        "other",
      ],
      default: "website",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "converted", "lost"],
      default: "new",
    },
    notes: {
      type: [noteSchema],
      default: [],
    },
    convertedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Create compound index for email + createdBy to ensure unique leads per user
leadSchema.index({ email: 1, createdBy: 1 }, { unique: true });

module.exports = mongoose.model("Lead", leadSchema);
