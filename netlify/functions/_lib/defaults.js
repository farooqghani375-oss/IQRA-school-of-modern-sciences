// Default/seed content. Used the FIRST time each blob store is read, so the
// live site keeps working with all of its existing content even before the
// admin has changed anything through the new admin panel.

const DEFAULT_GALLERY = {
  categories: [
    {
      key: 'Red', group: 'events', title: 'Red Day 2026', emoji: '🍎',
      photos: [],
      videos: [{ src: 'videos/red-day.mp4', caption: 'Red Day 2026' }],
    },
    {
      key: 'sports', group: 'events', title: 'Sports Day', emoji: '⚽',
      photos: [{ src: 'images/sport/s1.jpeg', caption: 'Sports Day' }],
      videos: [],
    },
    {
      key: 'art', group: 'events', title: 'Art Day', emoji: '🎨',
      photos: Array.from({ length: 6 }, (_, i) => ({
        src: `images/art/a (${i + 1}).jpeg`, caption: 'Art Exhibition',
      })),
      videos: [],
    },
    {
      key: 'results', group: 'academic', title: 'School Results', emoji: '🏆',
      photos: Array.from({ length: 18 }, (_, i) => ({
        src: `images/results/r (${i + 1}).jpeg`, caption: 'School Results',
      })),
      videos: [],
    },
    {
      key: 'tours', group: 'academic', title: 'School Tours', emoji: '🏫',
      photos: [
        { src: 'images/tour/t (1).jpeg', caption: 'School Tour' },
        { src: 'images/tour/t (2).jpeg', caption: 'School Tour' },
        { src: 'images/tour/t (3).jpeg', caption: 'School Tour' },
        { src: 'images/tour/t (4).jpeg', caption: 'School Tour' },
        { src: 'images/tour/t (5).jpeg', caption: 'School Tour' },
        { src: 'images/tour/t (6).jpeg', caption: 'School Tour' },
      ],
      videos: [{ src: 'videos/1.mp4', caption: 'School Tour' }],
    },
    {
      key: 'dastarbandi', group: 'events', title: 'Dastarbandi', emoji: '🎓',
      photos: Array.from({ length: 5 }, (_, i) => ({
        src: `images/Dastarbandi/D (${i + 1}).jpeg`, caption: 'Dastarbandi Ceremony',
      })),
      videos: [],
    },
    {
      key: 'building', group: 'campus', title: 'School Building', emoji: '🏛️',
      photos: Array.from({ length: 3 }, (_, i) => ({
        src: `images/building/b (${i + 1}).jpeg`, caption: 'School Campus',
      })),
      videos: [],
    },
  ],
};

const DEFAULT_ADMISSIONS = {
  intro: "Enrolling now for the new academic year. Seats are limited — secure your child's place today.",
  steps: [
    { title: 'Visit School', description: 'Come for a campus tour and meet our teachers' },
    {
      title: 'Assessment',
      description: '1. Birth Certificate OR Form B\n2. Father CNIC copy\n3. Two passport size pictures',
    },
    { title: 'Confirmation', description: 'Pay admission fee and get your welcome pack' },
  ],
};

// icon: one of the built-in keys below, or "custom" with a customIconUrl (e.g. a Cloudinary image)
const DEFAULT_SOCIAL_LINKS = [
  { id: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/923325216881', icon: 'whatsapp' },
  { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/', icon: 'facebook' },
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/', icon: 'instagram' },
  { id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/', icon: 'tiktok' },
];

module.exports = { DEFAULT_GALLERY, DEFAULT_ADMISSIONS, DEFAULT_SOCIAL_LINKS };
