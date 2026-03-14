// backend/src/models/CustomField.js
const mongoose = require("mongoose");

const customFieldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "text",
        "number",
        "date",
        "boolean",
        "select",
        "multiselect",
        "url",
        "email",
        "phone",
      ],
      required: true,
    },
    options: [String], // for select/multiselect
    defaultValue: mongoose.Schema.Types.Mixed,
    required: {
      type: Boolean,
      default: false,
    },
    placeholder: String,
    validation: {
      min: Number,
      max: Number,
      pattern: String,
      message: String,
    },
    order: Number,
    isActive: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model("CustomField", customFieldSchema);
