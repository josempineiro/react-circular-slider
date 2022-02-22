export default function (req, res) {
  res.status(200).json([
    {
      href: 'https://github.com/josempineiro',
      icon: 'Github',
    },
    {
      href: 'https://www.linkedin.com/in/josempineiro/',
      icon: 'LinkedIn',
    },
  ])
}
