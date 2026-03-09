import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    consultations: defineTable({
        company_name: v.string(),
        contact_name: v.string(),
        email: v.string(),
        phone: v.string(),
        privacy_consent: v.boolean(),
        createdAt: v.optional(v.number()),
    }),
    hospital_chatbot_leads: defineTable({
        privacy_consent: v.boolean(),
        hospital_name: v.string(),
        contact_name: v.string(),
        phone: v.string(),
        email: v.string(),
    }),
    leads: defineTable({
        contact_name: v.string(),
        email: v.string(),
        phone: v.string(),
        company_name: v.string(),
        industry: v.string(),
        privacy_consent: v.boolean(),
        utm_source: v.optional(v.string()),
        utm_medium: v.optional(v.string()),
        utm_campaign: v.optional(v.string()),
    })
        .index("by_industry", ["industry"]),
});
