import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        // unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ["Admin", "Manager", "User"],
        default: "User",
    },

    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
    },
    source: {
        type: String,
        enum: ["Google", "Facebook", "Instagram", "Direct", "Referral", "Email",],
        default: "Direct",
    },
    preferences: {
        notifications: {
            email: {
            type: Boolean,
            default: true,
            },
            browser: {
            type: Boolean,
            default: true,
            },
            weeklyReport: {
            type: Boolean,
            default: false,
            },
            orderUpdates: { type: Boolean, default: true },
            customerActivity: { type: Boolean, default: true },
            weeklyReports: { type: Boolean, default: false },
            securityAlerts: { type: Boolean, default: true },
            loginAlerts: { type: Boolean, default: true },
        },

        appearance: {
            theme: {
            type: String,
            enum: ["light", "dark", "system"],
            default: "system",
            },
        },
    },
    sessions: [{
        _id: false,
        sid: { type: String, required: true },
        userAgent: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now },
        lastActiveAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, required: true },
    }],
    generalSettings: {
        workspaceName: { type: String, default: "PulseBoard Enterprise", trim: true },
        description: { type: String, default: "Enterprise analytics and business intelligence workspace.", trim: true },
        language: { type: String, enum: ["en", "hi"], default: "en" },
        timezone: { type: String, enum: ["Asia/Kolkata", "UTC", "America/New_York", "Europe/London"], default: "Asia/Kolkata" },
    },
},
{
    timestamps: true,
})

export default mongoose.model('User', userSchema)
