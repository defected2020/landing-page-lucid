// Shared by the homepage Team section and the About page so both stay in sync.
// `id` is also the author key in data/blogPosts.js and the fragment in each
// Person's schema @id, so a name or role only ever gets edited here.
const team = [
  {
    id: 'aline',
    name: 'Aline Bornschein',
    role: 'Founder & Machine Learning Engineer',
    image: '/images/aline3.png',
    focus:
      'Leads the machine learning and data side of our work, from model integration and evaluation through to the data pipelines that feed them.',
  },
  {
    id: 'george',
    name: 'George Beard',
    role: 'Founder & Fullstack Developer',
    image: '/images/geroge.png',
    focus:
      'Leads product engineering across web and mobile, covering architecture, backend systems, and the front-end craft that makes them feel effortless.',
  },
];

export const findTeamMember = (id) => team.find((member) => member.id === id);

export default team;
