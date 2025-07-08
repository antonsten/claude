import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.union([z.date(), z.string(), z.string().transform(str => new Date(str))]).optional(),
        readingTime: z.union([z.number(), z.string(), z.string().transform(str => parseInt(str, 10))]).optional(),
        layout: z.string().optional(),
        slug: z.string().optional(),
        image: z.string().optional()
    })
});

const testimonialSchema = z.object({
    bgColor: z.string(),
    textColor: z.string().optional(),
    logo: z.string().optional(),
    quote: z.array(z.string()),
    author: z.string(),
    role: z.string()
});

const featuredWritingSchema = z.object({
    title: z.string(),
    date: z.string(),
    url: z.string(),
    icon: z.string()
});

const contactInfoSchema = z.object({
    email: z.string().email(),
    social: z.object({
        linkedin: z.string().url()
    }),
    location: z.string()
});

const coachingOptionSchema = z.object({
    title: z.string(),
    description: z.string()
});

const imageSchema = z.object({
    src: z.string(),
    alt: z.string()
});

const technologyItemSchema = z.object({
    name: z.string(),
    value: z.string(),
    url: z.string().optional()
});

const designItemSchema = z.object({
    name: z.string(),
    value: z.string(),
    url: z.string().optional()
});

const privacySchema = z.object({
    text: z.string(),
    analyticsUrl: z.string()
});

const sourceCodeSchema = z.object({
    text: z.string(),
    url: z.string()
});

export const collections = {
    'articles': articles,
}; 