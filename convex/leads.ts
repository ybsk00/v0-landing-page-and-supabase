import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const VALID_INDUSTRIES = ["hospital", "ecommerce", "education", "professional", "other"];

export const submitLead = mutation({
    args: {
        contact_name: v.string(),
        email: v.string(),
        phone: v.string(),
        company_name: v.string(),
        industry: v.string(),
        privacy_consent: v.boolean(),
        utm_source: v.optional(v.string()),
        utm_medium: v.optional(v.string()),
        utm_campaign: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (!args.privacy_consent) {
            throw new Error("개인정보 제공에 동의해야 합니다.");
        }
        if (!VALID_INDUSTRIES.includes(args.industry)) {
            throw new Error(`Invalid industry: ${args.industry}`);
        }
        return await ctx.db.insert("leads", args);
    },
});

export const getLeads = query({
    args: {
        industry: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (args.industry) {
            return await ctx.db
                .query("leads")
                .withIndex("by_industry", (q) => q.eq("industry", args.industry!))
                .order("desc")
                .collect();
        }
        return await ctx.db
            .query("leads")
            .withIndex("by_creation")
            .order("desc")
            .collect();
    },
});
