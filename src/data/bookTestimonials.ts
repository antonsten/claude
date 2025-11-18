export interface BookTestimonial {
  title: string;
  body: string[];
  author: string;
  role: string;
  avatar?: string;
}

export const bookTestimonials: BookTestimonial[] = [
  {
    title: "This book captures what most product design resources miss: the human relationships that make or break building great products.",
    body: [
      "Anton's practical approach to everything from user research to internal communication reads like advice from a trusted mentor. I wish I'd had this book earlier in my career."
    ],
    author: "Kevin Twohy",
    role: "Principal Designer, Twohy Design Works",
    avatar: "/images/author/avatar_kevin_twohy.webp"
  },
  {
    title: "If you're tired of design books that talk in circles, this one actually addresses the work as it is.",
    body: [
      "The rare design book that cuts through the noise and gets to the heart of what matters: designing for real people. Anton is direct about the realities of product design—the messy trade-offs, the pressure to ship, the challenge of balancing business goals with actual user needs. If you're tired of design books that talk in circles, this one addresses the work as it is."
    ],
    author: "Fedor Shkliarau",
    role: "Author of Product Design Portfolio Final Final",
    avatar: "/images/author/avatar_fedor_shkliarau.webp"
  },
  {
    title: "Anton's nailed it — this is the guide every Product Designer wishes they had.",
    body: [
      "Anton's nailed it — this is the guide every Product Designer wishes they had. It's practical, super relevant for 2025 and honestly the stuff UX schools should have been teaching us all along!"
    ],
    author: "Buzz Usborne",
    role: "Principal Designer & Coach",
    avatar: "/images/author/avatar_buzz_usborne.webp"
  },
  {
    title: "A design mentor in book-form",
    body: [
      "What I like about this book is that it's an easy read that talks about design in a holistic way.",
      "It's a book I wish I read at the beginning of my career, because it really shows the many facets that make up design and underlines it with personal stories, concrete examples and practical tips.",
      "Now reading this book further into my career it still is insightful - but also just very relatable and reassuring. Truly a design mentor in book-form."
    ],
    author: "Maureen Herben",
    role: "Senior designer, Typeform",
    avatar: "/images/author/avatar_maureen_herben.webp"
  },
  {
    title: "Sharp, grounded, and unflinching. A reminder that success isn't about features, it's about outcomes that matter.",
    body: [
      "Most design books are written from the sidelines. This one is written from the arena. Anton's Products People Actually Want doesn't dress design up in theory—it lays bare the real, messy work of building products people care about."
    ],
    author: "Sharif Matar",
    role: "Design Leader",
    avatar: "/images/author/avatar_sharif_matar.webp"
  },
  {
    title: "The structure is simple and guides you through a designer's maturing process in a way that just clicks.",
    body: [
      "The structure is simple and guides you through a designer's maturing process in a way that just clicks. If I had to pick one highlight, it's the one-hand test—worth the read for that alone.",
      "Easy to read, informative, and entertaining. Good UX."
    ],
    author: "David Reina",
    role: "Strategy Director",
    avatar: "/images/author/avatar_david_reina.webp"
  }
];
